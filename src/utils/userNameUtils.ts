// Utility functions for handling user names consistently

export const storeUserEnteredName = (name: string) => {
  if (name && name.trim()) {
    localStorage.setItem('enteredUserName', name.trim());
  }
};

export const getUserEnteredName = (): string | null => {
  return localStorage.getItem('enteredUserName');
};

export const extractUserNameFromRegistration = (): string | null => {
  try {
    const registrationData = localStorage.getItem('sellerRegistrationData');
    if (registrationData) {
      const regData = JSON.parse(registrationData);
      if (regData.firstName && regData.firstName.trim()) return regData.firstName.trim();
      if (regData.name && regData.name.trim()) return regData.name.trim();
      if (regData.fullName && regData.fullName.trim()) return regData.fullName.trim();
    }
  } catch {
    return null;
  }
  return null;
};

/**
 * Simpel, prioriterer fornavn, ellers navn, ellers email, ellers "Bruger"
 */
export function getDisplayName(user: any): string {
  if (!user) return "Bruger";
  if (user.name && user.name.trim()) {
    return user.name.split(" ")[0];
  }
  if (user.firstName && user.firstName.trim()) {
    return user.firstName;
  }
  if (user.email && user.email.trim()) {
    return user.email.split("@")[0];
  }
  return "Bruger";
}
