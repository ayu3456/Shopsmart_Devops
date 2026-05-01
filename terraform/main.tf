terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

# 1. S3 Bucket Required Config
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "shopsmart_bucket" {
  bucket = "shopsmart-bucket-${random_id.bucket_suffix.hex}"
}

resource "aws_s3_bucket_versioning" "shopsmart_versioning" {
  bucket = aws_s3_bucket.shopsmart_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "shopsmart_encryption" {
  bucket = aws_s3_bucket.shopsmart_bucket.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "shopsmart_public_block" {
  bucket                  = aws_s3_bucket.shopsmart_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. ECR Repository
resource "aws_ecr_repository" "shopsmart_repo" {
  name                 = "shopsmart-repo"
  image_tag_mutability = "MUTABLE"
  force_delete         = true
}

# 3. ECS Cluster
resource "aws_ecs_cluster" "shopsmart_cluster" {
  name = "shopsmart-cluster"
}

# IAM Role for Task Execution
resource "aws_iam_role" "ecs_execution_role" {
  name = "shopsmart_ecs_execution_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_execution_role_policy" {
  role       = aws_iam_role.ecs_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Default VPC and Subnets
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group
resource "aws_security_group" "ecs_sg" {
  name        = "shopsmart-ecs-sg"
  description = "Allow port 3000"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ECS Task Definition (Initial dummy, replaced by GitHub Action)
resource "aws_ecs_task_definition" "shopsmart_task" {
  family                   = "shopsmart-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "shopsmart-container"
      image     = "nginx:alpine"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    }
  ])
}

# ECS Service
resource "aws_ecs_service" "shopsmart_service" {
  name            = "shopsmart-service"
  cluster         = aws_ecs_cluster.shopsmart_cluster.id
  task_definition = aws_ecs_task_definition.shopsmart_task.arn
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition]
  }
}

output "ecr_repository_url" {
  value = aws_ecr_repository.shopsmart_repo.repository_url
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.shopsmart_cluster.name
}

output "ecs_service_name" {
  value = aws_ecs_service.shopsmart_service.name
}
