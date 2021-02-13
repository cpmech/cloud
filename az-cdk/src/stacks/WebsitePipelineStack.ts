import { Construct, Stack, StackProps, SecretValue, RemovalPolicy } from '@aws-cdk/core';
import { Artifact, Pipeline } from '@aws-cdk/aws-codepipeline';
import { PipelineProject, LinuxBuildImage, BuildSpec } from '@aws-cdk/aws-codebuild';
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

export interface IWebsitePipelineStackProps extends StackProps {
  githubRepo: string; // e.g. myrepo (not the full path)
  githubUser: string; // the user (owner) of the GH repo
  githubSecret: SecretValue; // the secret to access GitHub
  websiteBucketName: string; // e.g. "mydomain.com-website"
  cloudfrontDistributionId: string; // cloudfront distribution id
  assetsDir?: string; // default is 'dist'
  nocacheFiles?: string[]; // default [index.html]
  envars?: Ienvars; // environment variables
  useYarn?: boolean; // default: use NPM
  notificationEmails?: string[]; // emails to receive notifications
  useConfirmation?: boolean;
}

export class WebsitePipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: IWebsitePipelineStackProps) {
    super(scope, id, props);

    const assets = props.assetsDir || 'dist';
    const nocacheFiles = props.nocacheFiles || ['index.html'];
    const nocachePaths = '/' + nocacheFiles.join(' /');
    const nocacheOptions = 'max-age=0, no-cache, no-store, must-revalidate';
    const distroId = props.cloudfrontDistributionId;
    const cmds = npmCommands(props.useYarn);

    const bucket = Bucket.fromBucketName(this, 'Deployment', props.websiteBucketName);
    const name = bucket.bucketName;

    const project = new PipelineProject(this, 'Project', {
      environment: {
        buildImage: LinuxBuildImage.STANDARD_2_0,
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
            commands: [
              `aws s3 cp --recursive --acl public-read ./${assets} s3://${name}/`,
              ...nocacheFiles.map(
                (f) =>
                  `aws s3 cp --acl public-read --cache-control="${nocacheOptions}" ./${assets}/${f} s3://${name}/`,
              ),
              `aws cloudfront create-invalidation --distribution-id ${distroId} --paths ` +
                nocachePaths,
            ],
          },
        },
        artifacts: {
          files: [`**/*`],
          'base-directory': assets,
        },
      }),
    });

    bucket.grantPut(project);

    (project.role as IRole).addToPrincipalPolicy(
      new PolicyStatement({
        actions: ['cloudfront:CreateInvalidation'],
        resources: ['*'],
      }),
    );

    const sourceOutput = new Artifact();
    const sourceAction = new GitHubSourceAction({
      actionName: 'SourceAction',
      owner: props.githubUser,
      repo: props.githubRepo,
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
