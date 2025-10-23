# Use official Node Alpine image
FROM node:22.15.0-alpine AS builder

# Install build tools and utilities
RUN apk update && apk add --no-cache \
    curl \ 
    libc6-compat \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    nasm \
    bash \
    vips-dev \
    git \
    cmake \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy only package files first to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies early to cache them
RUN yarn install

# Now copy the rest of the app source
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Expose dev server port
EXPOSE 3000
EXPOSE 9000

# Start development server with both Next.js and Storybook
CMD ["yarn", "dev-concurrently"]
