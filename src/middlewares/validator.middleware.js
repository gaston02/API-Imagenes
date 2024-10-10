export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    console.log("schema validado correctamente");
    next();
  } catch (error) {
    let errorMessage;
    if (error.errors && error.errors.length > 0 && error.errors[0].message) {
      console.log(`Error if ${error.errors.message}`);
      errorMessage = error.errors[0].message;
    } else {
      console.log(`Error else ${error.message}`);
      errorMessage = error.message;
    }
    console.log(`Error antes del status ${error.message}`);
    res.status(400).json({ error: errorMessage });
  }
};

export const validateSchemaParams = (schema) => (req, res, next) => {
  try {
    schema.parse(req.params);
    next();
  } catch (error) {
    let errorMessage;
    if (error.errors && error.errors.length > 0 && error.errors[0].message) {
      errorMessage = error.errors[0].message;
    } else {
      errorMessage = error.message;
    }
    res.status(400).json({ error: errorMessage });
  }
};
