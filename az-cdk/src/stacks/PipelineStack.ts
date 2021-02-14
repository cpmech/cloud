import { Construct, Stack, StackProps, SecretValue, RemovalPolicy } from '@aws-cdk/core';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { PipelineProject, LinuxBuildImage, BuildSpec, IBuildImage } from '@aws-cdk/aws-codebuild';
import {
  GitHubSourceAction,
  CodeBuildAction,
  ManualApprovalAction,
} from '@aws-cdk/aws-codepipeline-actions';
import { PolicyStatement, IRole } from '@aws-cdk/aws-iam';
import { Bucket } from '@aws-cdk/aws-s3';
import { envars2cdk, Ienvars } from '../helpers/envars2cdk';
import { npmCommands } from '../helpers/npmCommands';
import { PipelineNotificationConstruct } from '../constructs/PipelineNotificationConstruct';

export interface IPipelineStackProps extends StackProps {
  githubRepo: string; // e.g. myrepo (not the full path)
  githubUser: string; // the user (owner) of the GH repo
  githubSecret: SecretValue; // the secret to access GitHub
  githubBranch?: string; // default = "main"
  services: string[]; // e.g. ['apigateway','lambda'] => to set permissions
  group?: string; // e.g. service [default=service]
  envars?: Ienvars; // environment variables
  npmBeforeTest?: string; // extra command before test; "npm install" to force postinstall hook
  useYarn?: boolean; // default: use NPM
  notificationEmails?: string[]; // emails to receive notifications
  useConfirmation?: boolean;
  stage?: string;
  buildImage?: IBuildImage; // see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
}

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: IPipelineStackProps) {
    super(scope, id, props);

    const group = props.group || 'service';
    const stage = props.stage || '';
    const cmds = npmCommands(props.npmBeforeTest, props.useYarn);

    const commands = props.useYarn
      ? [`yarn cdk ${group} deploy ${stage} --require-approval never`]
      : [`npm run cdk -- ${group} deploy ${stage} --require-approval never`];

    const project = new PipelineProject(this, 'Project', {
      environment: {
        buildImage: props.buildImage || LinuxBuildImage.STANDARD_5_0,
      },
      environmentVariables: props.envars ? envars2cdk(props.envars) : {},
      buildSpec: BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: cmds.install,
          },
          build: {
            commands: cmds.build,
          },
          post_build: {
            commands,
          },
        },
      }),
    });

    const services = ['cloudformation', 's3', 'iam', ...props.services];
    services.forEach((s) => {
      (project.role as IRole).addToPrincipalPolicy(
        new PolicyStatement({
          actions: [`${s}:*`],
          resources: ['*'],
        }),
      );
    });

    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: 'SourceAction',
      owner: props.githubUser,
      repo: props.githubRepo,
      branch: props.githubBranch || 'main',
      oauthToken: props.githubSecret,
      output: sourceOutput,
    });

    const buildOutput = new Artifact();
    const buildAction = new CodeBuildAction({
      actionName: 'BuildAction',
      project,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    const artifacts = new Bucket(this, 'Artifacts', {
      bucketName: `${id.toLowerCase()}-artifacts`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const pipeline = new Pipeline(this, 'Pipeline', {
      artifactBucket: artifacts,
      restartExecutionOnUpdate: true,
    });

    pipeline.addStage({ stageName: 'Source', actions: [sourceAction] });

    if (props.useConfirmation) {
      pipeline.addStage({
        stageName: 'Confirmation',
        actions: [new ManualApprovalAction({ actionName: 'AreYouSure' })],
      });
    }

    pipeline.addStage({ stageName: 'Build', actions: [buildAction] });

    if (props.notificationEmails) {
      new PipelineNotificationConstruct(this, `${id}PNC`, {
        topicName: `${id}-notifications`,
        emails: props.notificationEmails,
        pipeline,
      });
    }
  }
}
