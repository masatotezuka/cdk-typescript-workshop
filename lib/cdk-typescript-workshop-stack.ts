import { CfnOutput, Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { readFileSync } from "fs"

export class CdkTypescriptWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const vpc = new ec2.Vpc(this, "BlogVpc", {
      vpcName: "BlogVpc",
      ipAddresses: ec2.IpAddresses.cidr("10.0.0.0/16"),
    })

    const webserver = new ec2.Instance(this, "WebServer", {
      vpc,
      //@see:https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.InstanceClass.html
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.SMALL
      ),
      //@see:https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.AmazonLinuxImage.html
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      // @see: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetSelection.html
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
    })

    const script = readFileSync("./lib/resources/user-data.sh", "utf-8")
    // EC2インスタンスにユーザーデータを追加
    webserver.addUserData(script)

    // port80に対して、全てのIPv4アドレスからのアクセスを許可
    webserver.connections.allowFromAnyIpv4(ec2.Port.tcp(80))

    new CfnOutput(this, "WebServerPublicIp", {
      value: `http://${webserver.instancePublicIp}`,
    })
  }
}
