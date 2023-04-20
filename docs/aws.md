# AWS S3 Notes

## Setup Process

1. Created S3 Bucket using all default settings
2. Created a user "steve" through the IAM console in browser
3. Created auth token for that user for "Application running outside AWS"
4. Named the token 'sciren-admin-token'
5. Allowed public access for the bucket
6. Pasted a JSON policy (typed below) into the sciren bucket policy
7. Added cross-origin resource sharing config (listed below)
8. Installed `aws-sdk` and `@types/aws-sdk`


## Configuration

- Bucket Name: sciren
- User Name: steve
  - perms: admin, AmazonS3AllAccess

### Bucket Policy

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": [
                "arn:aws:s3:::sciren",
                "arn:aws:s3:::sciren/*"
            ]
        }
    ]
}
```

### Cross-Origin Resource Sharing Config

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ]
    }
]
```
