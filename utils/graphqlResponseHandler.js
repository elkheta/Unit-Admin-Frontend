function transformValidationErrors(validationErrors) {
  const transformedErrors = [];
  const validationMessages = [];

  for (const field in validationErrors) {
    if (Object.prototype.hasOwnProperty.call(validationErrors, field)) {
      const transformedField = field.replace(/^input\./, '');
      const messages = validationErrors[field];

      transformedErrors.push({
        field: transformedField,
        messages
      });

      if (Array.isArray(messages)) validationMessages.push(...messages);
    }
  }

  return { transformedErrors, validationMessages };
}

/**
 * Normalize Apollo Client mutation result (when using errorPolicy: 'all').
 * @param {{data?: any, errors?: any[]}|null|undefined} response
 * @param {string} operationName - The field name inside data, e.g. "loginUser"
 */
function handleResponse(response, operationName) {
  if (!response) {
    return {
      success: false,
      message: 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى.',
      displayValidationMessages: ['لقد حدث خطأ ما يرجى المحاولة مرة اخرى.']
    };
  }

  if (response.errors && response.errors.length > 0) {
    const error = response.errors[0];
    const extensions = error.extensions || {};

    const validation = extensions.validation
      ? transformValidationErrors(extensions.validation)
      : { transformedErrors: null, validationMessages: null };

    const fallbackMessages = error.message ? [error.message] : ['لقد حدث خطأ ما يرجى المحاولة مرة اخرى.'];
    const displayValidationMessages =
      validation.validationMessages && validation.validationMessages.length > 0
        ? validation.validationMessages
        : fallbackMessages;

    return {
      success: false,
      message: error.message || 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى.',
      messageCode: extensions.message_code || extensions.messageCode || '',
      messageData: extensions.message_data || extensions.messageData || '',
      validationErrors: validation.transformedErrors,
      validationMessages: validation.validationMessages,
      displayValidationMessages
    };
  }

  if (response.data && response.data[operationName]) {
    return {
      success: true,
      data: response.data[operationName]
    };
  }

  return {
    success: false,
    message: 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى.',
    displayValidationMessages: ['لقد حدث خطأ ما يرجى المحاولة مرة اخرى.']
  };
}

/**
 * Normalize thrown ApolloError (network errors, or when errorPolicy != 'all').
 */
function handleApolloException(error) {
  const graphQLError = error?.graphQLErrors?.[0];
  if (graphQLError) {
    return handleResponse({ errors: [graphQLError] }, '');
  }

  if (error?.networkError) {
    return {
      success: false,
      message: 'خطأ في الاتصال بالخادم',
      displayValidationMessages: ['خطأ في الاتصال بالخادم']
    };
  }

  return {
    success: false,
    message: error?.message || 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى.',
    displayValidationMessages: [error?.message || 'لقد حدث خطأ ما يرجى المحاولة مرة اخرى.']
  };
}

export { handleResponse, handleApolloException, transformValidationErrors };


