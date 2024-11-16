#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkTypescriptWorkshopStack } from '../lib/cdk-typescript-workshop-stack';

const app = new cdk.App();
new CdkTypescriptWorkshopStack(app, 'CdkTypescriptWorkshopStack');
