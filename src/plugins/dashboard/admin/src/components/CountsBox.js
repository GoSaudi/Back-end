import React from "react";
import { Box, Typography, Stack } from "@strapi/design-system";

export default function CountsBox({ label, count }) {
  return (
    <Box
      padding={4}
      background="neutral0"
      shadow="filterShadow"
      style={{ borderBottom: "2px solid green", flex: 1, minWidth: "120px" }}
    >
      <Stack>
        <Typography
          variant="omega"
          textColor="neutral600"
          style={{ marginBottom: "20px" }}
        >
          {label}
        </Typography>
        <Typography variant="alpha">{count}</Typography>
      </Stack>
    </Box>
  );
}
