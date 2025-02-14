const validator = require('validator');

const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName || !emailId || !password) {
    throw new Error('Please provide all the required fields');
  } else if (firstName.length < 4 || firstName.length > 25) {
    throw new Error('First name should be between 4 to 25 characters');
  } else if (password.length < 8) {
    throw new Error('Password should be minimum 8 characters');
  } else if (!validator.isEmail(emailId)) {
    throw new Error('Invalid email address');
  } else {
    return true;
  }
};

const validateEditProfileData = (req) => {
  const { firstName, lastName, age, gender, about, skills, photoUrl } =
    req.body;
  const ALLOWED_UPDATES = [
    'firstName',
    'lastName',
    'age',
    'skills',
    'about',
    'photoUrl',
  ];

  const isUpdateAllowed = Object.keys(req.body).every((update) =>
    ALLOWED_UPDATES.includes(update)
  );

  if (!isUpdateAllowed) {
    throw new Error('Update not allowed for some fields');
  } else if (firstName && (firstName.length < 4 || firstName.length > 25)) {
    throw new Error('First name should be between 4 to 25 characters');
  } else if (age && age < 18) {
    throw new Error('Age should be minimum 18 years');
  } else if (photoUrl && !validator.isURL(photoUrl)) {
    throw new Error('Invalid URL');
  } else {
    return true;
  }
};

module.exports = { validateSignupData, validateEditProfileData };
