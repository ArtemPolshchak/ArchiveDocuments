package archive.main.controller;

import archive.main.exception.AccessForbiddenException;
import archive.main.exception.ItemExistsException;
import archive.main.exception.ItemNotFoundException;
import archive.main.exception.EmailNotFoundException;
import archive.main.exception.ErrorResponse;
import archive.main.exception.UnauthorizedActionException;
import archive.main.exception.UserNotFoundException;
import archive.main.exception.UserWithDataExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlingControllerAdvice {

    private static final String MESSAGE = "message";

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((ObjectError error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }

    @ExceptionHandler(ErrorResponse.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    @ResponseBody
    Map<String, String> handleCustomException(ErrorResponse  ex) {
        return Map.of(MESSAGE, ex.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> userNotFoundHandler(UserNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UnauthorizedActionException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> handleUnauthorizedActionException(UnauthorizedActionException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(EmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> handleEmailNotFoundException(EmailNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(UserWithDataExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    Map<String, String> handleUserWithDataExistsException(UserWithDataExistsException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public Map<String, String> handleAccessDeniedException(org.springframework.security.access.AccessDeniedException ex) {
        return Map.of(MESSAGE, "Access is denied");
    }

    @ResponseBody
    @ExceptionHandler(AccessForbiddenException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    Map<String, String> handleUserWithDataExistsException(AccessForbiddenException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(ItemExistsException.class)
    @ResponseStatus(value = HttpStatus.BAD_REQUEST)
    Map<String, String> handleUserWithDataExistsException(ItemExistsException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }

    @ResponseBody
    @ExceptionHandler(ItemNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    Map<String, String> handleEmailNotFoundException(ItemNotFoundException exception) {
        return Map.of(MESSAGE, exception.getMessage());
    }
}
