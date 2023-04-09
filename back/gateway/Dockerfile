# Use the official Go image as the base image
FROM golang:1.20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY . .

# Build the Go binary inside the container
RUN go build -o gateway .

# Expose port 8080 for incoming requests
EXPOSE 8080

# Start the gateway when the container starts
CMD ["/app/gateway"]
