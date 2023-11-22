variable "pstg_db_password" {
  description = "Password for the database"
  type        = string
  sensitive   = true
}

variable "pstg_db_identifier" {
  description = "Identifier for the database"
  type        = string
}

variable "pstg_db_username" {
  description = "User name for the database"
  type        = string
}


variable "pstg_db_port" {
  description = "Port for the database"
  type        = number
  default     = 5432
}

variable "aws_ami_id" {
  description = "AMI ID for the EC2 instances"
  type        = string
}

variable "aws_instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "domain_name" {
  description = "Domain name"
  type        = string
  default     = "evgkoch.site"
}
