/** Vietnamese mobile number: 0 or +84, then 3/5/7/8/9, then 8 digits. Shared by client and server checkout validation. */
export const VN_PHONE_REGEX = /^(0|\+84)[35789][0-9]{8}$/;
