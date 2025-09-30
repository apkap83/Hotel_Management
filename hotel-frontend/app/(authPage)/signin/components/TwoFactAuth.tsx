import { Box } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import React from 'react';
import { config } from '@hotel_manage/config';

export function TwoFactAuth({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return null;
  //(
  // <Box display="flex" justifyContent="center" alignItems="center">
  //   <MuiOtpInput
  //     autoFocus
  //     length={config.TwoFactorDigitsLength}
  //     // ref={otpInputRef} // Attach ref to the MuiOtpInput
  //     value={value}
  //     onChange={onChange}
  //   />
  // </Box>
  //);
}
