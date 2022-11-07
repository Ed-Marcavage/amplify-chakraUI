export type AmplifyDependentResourcesAttributes = {
    "api": {
        "amplifychakraui": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "storage": {
        "imagestorage": {
            "BucketName": "string",
            "Region": "string"
        },
        "ArtifactTable": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "Region": "string"
        }
    }
}