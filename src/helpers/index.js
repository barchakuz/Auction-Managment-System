export const getAvatar = (name) =>
  `https://avatars.dicebear.com/api/initials/:${name}.svg`;

export const capitalize = (str = "") =>
  str.charAt(0).toUpperCase() + str.slice(1);

export * from "./products";
