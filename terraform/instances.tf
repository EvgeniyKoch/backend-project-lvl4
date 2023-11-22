resource "aws_instance" "web_servers" {
  count         = 2
  ami           = var.aws_ami_id
  instance_type = var.aws_instance_type
  key_name      = aws_key_pair.production_key_pair.key_name

  vpc_security_group_ids = [aws_security_group.web_sg.id]

  tags = {
    Name = "WebServer-${count.index + 1}"
  }
}

resource "aws_key_pair" "production_key_pair" {
  key_name   = "production-key"
  public_key = file("~/.ssh/aws_key.pub")
}
