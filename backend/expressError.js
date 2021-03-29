/** ExpressError extends standard JavaScript error,
 * adding a custom message and status to.
 */

class ExpressError extends Error {
    constructor (message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}

/** 404 Error - Page Not Found */
class NotFoundError extends ExpressError {
    constructor (message = "Not Found") {
        super(message, 404);
    }
}

/** 401 Error - Unauthorized. */
class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
      super(message, 401);
    }
  }
  
  /** 400 Error - Bad Request. */
  
  class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }

module.exports = {
    ExpressError,
    NotFoundError,
    UnauthorizedError,
    BadRequestError
}