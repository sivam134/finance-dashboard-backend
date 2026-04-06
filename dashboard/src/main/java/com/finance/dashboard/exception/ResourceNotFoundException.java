package com.finance.dashboard.exception;

// Thrown when a requested resource is not found
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    //  for chaining exceptions
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}