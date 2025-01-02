const validateCodeFormat = (code: string): boolean => {
    const codeRegex = /^\d{4}-[a-zA-Z0-9]{3}$/;
    return codeRegex.test(code);
  };
  