import os

def handler(event, context):
    path = os.popen("echo $PATH").read()
    directories = os.popen("find /opt/* -type d -maxdepth 4").read().split("\n")
    print(path)
    print(directories)

    return {
        'statusCode': 200,
        'body': {'success': 'YES', 'path': path, 'directories': directories}
    }
