import AWS from 'aws-sdk';
import { hasProp, email2key } from '@cpmech/basic';
import { report } from './util/report';

const DEFAULT_RULE_SET = 'default-rule-set';

// createOrUpdateDefaultRuleSet creates or update rules
const createOrUpdateDefaultRuleSet = async (emails: string[], topicArns: string[]) => {
  // list existent rules
  const ses = new AWS.SES();
  const sets = await ses.listReceiptRuleSets().promise();

  // collect rule names
  let hasDefaultRuleSet = false;
  let existentNames: string[] = [];
  if (sets.RuleSets) {
    const drs = sets.RuleSets.find((s) => s.Name === DEFAULT_RULE_SET);
    if (drs) {
      hasDefaultRuleSet = true;
      const res = await ses.describeReceiptRuleSet({ RuleSetName: DEFAULT_RULE_SET }).promise();
      if (res.Rules) {
        existentNames = res.Rules.map((r) => r.Name);
      }
    }
  }

  // create default rule set
  if (!hasDefaultRuleSet) {
    await ses.createReceiptRuleSet({ RuleSetName: DEFAULT_RULE_SET }).promise();
  }

  // create or update rules
  let i = 0;
  for (const email of emails) {
    const name = email2key(email);
    const data = {
      RuleSetName: DEFAULT_RULE_SET,
      Rule: {
        Actions: [
          {
            SNSAction: {
              Encoding: 'UTF-8',
              TopicArn: topicArns[i],
            },
          },
        ],
        Enabled: true,
        Name: name,
        Recipients: [email],
      },
    };
    if (existentNames.includes(name)) {
      await ses.updateReceiptRule(data).promise();
    } else {
      await ses.createReceiptRule(data).promise();
    }
    i++;
  }

  // activate default rule set
  await ses.setActiveReceiptRuleSet({ RuleSetName: DEFAULT_RULE_SET }).promise();
};

// deleteRulesFromDefaultRuleSet deletes rules
const deleteRulesFromDefaultRuleSet = async (emails: string[]) => {
  // list existent rules
  const ses = new AWS.SES();
  const sets = await ses.listReceiptRuleSets().promise();

  // collect rule names
  let hasDefaultRuleSet = false;
  let existentNames: string[] = [];
  if (sets.RuleSets) {
    const drs = sets.RuleSets.find((s) => s.Name === DEFAULT_RULE_SET);
    if (drs) {
      hasDefaultRuleSet = true;
      const res = await ses.describeReceiptRuleSet({ RuleSetName: DEFAULT_RULE_SET }).promise();
      if (res.Rules) {
        existentNames = res.Rules.map((r) => r.Name);
      }
    }
  }

  // delete rules
  let allConsidered = true;
  for (const email of emails) {
    const name = email2key(email);
    if (existentNames.includes(name)) {
      await ses
        .deleteReceiptRule({
          RuleName: name,
          RuleSetName: DEFAULT_RULE_SET,
        })
        .promise();
    } else {
      allConsidered = false;
    }
  }

  // delete default rule set
  if (hasDefaultRuleSet && allConsidered && existentNames.length === emails.length) {
    await ses.setActiveReceiptRuleSet().promise();
    await ses.deleteReceiptRuleSet({ RuleSetName: DEFAULT_RULE_SET }).promise();
  }
};

// sesDefaultRuleSet sets default rule set
//
// INPUT:
//   event.ResourceProperties {
//     Emails: string[];
//     TopicArns: string[];
//   }
//
// OUTPUT:
//   The PhysicalResourceId will be equal to DEFAULT_RULE_SET
//
export const sesDefaultRuleSet = async (event: any, context: any) => {
  try {
    // check input
    if (!hasProp(event.ResourceProperties, 'Emails')) {
      throw new Error(`ResourceProperties must have Emails prop`);
    }
    if (!hasProp(event.ResourceProperties, 'TopicArns')) {
      throw new Error(`ResourceProperties must have TopicArns prop`);
    }

    // extract input
    const { Emails, TopicArns } = event.ResourceProperties;

    // set the physical resource Id
    let resourceId = DEFAULT_RULE_SET;

    // handle request
    switch (event.RequestType) {
      case 'Create':
        console.log('..... creating default rule-set ......');
        await createOrUpdateDefaultRuleSet(Emails, TopicArns);
        break;

      case 'Update':
        console.log('..... updating default rule-set ......');
        await createOrUpdateDefaultRuleSet(Emails, TopicArns);
        break;

      case 'Delete':
        console.log('..... deleting default rule-set ......');
        await deleteRulesFromDefaultRuleSet(Emails);
        resourceId = event.PhysicalResourceId;
        break;

      default:
        throw new Error(`unsupported request type ${event.RequestType}`);
    }

    // return SUCCESS message
    const responseData = {};
    await report(event, context, 'SUCCESS', resourceId, responseData);
    //
    // handle errors
  } catch (err) {
    await report(event, context, 'FAILED', '', null, `${err}`);
  }
};
