import { useFetchClient } from "@strapi/helper-plugin";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Flex, Box, Typography, Stack, Divider } from "@strapi/design-system";

export default function BookingDetailsComponent() {
  const params = useParams();
  const client = useFetchClient();
  const [data, setData] = useState({});
  useEffect(() => {
    if (params?.booking) {
      client.get("/dashboard/bookingDetails/" + params.id).then((data) => {
        console.log(data);
        setData(data.data);
      });
    }
  }, [params?.booking, params.id]);

  if (!params?.booking) return null;

  return (
    <Flex gap={4} wrap={"wrap"}>
      <Box
        padding={4}
        background="neutral0"
        shadow="filterShadow"
        style={{ flex: 1 }}
      >
        <Stack>
          <Typography
            variant="omega"
            textColor="neutral600"
            style={{ marginBottom: "6px" }}
          >
            Vendor
          </Typography>
          <Divider />
          <Typography
            variant="omega"
            style={{ marginBottom: "4px", marginTop: "6px" }}
          >
            {data?.activity?.vendor?.name}
          </Typography>
          <Typography variant="omega" style={{ marginBottom: "4px" }}>
            {data?.activity?.vendor?.phone}
          </Typography>
          <Typography variant="omega" style={{ marginBottom: "4px" }}>
            {data?.activity?.vendor?.email}
          </Typography>
        </Stack>
      </Box>

      <Box
        padding={4}
        background="neutral0"
        shadow="filterShadow"
        style={{ flex: 1 }}
      >
        <Stack>
          <Typography
            variant="omega"
            textColor="neutral600"
            style={{ marginBottom: "6px" }}
          >
            Activity Type
          </Typography>
          <Divider />
          <Typography
            variant="omega"
            style={{ marginBottom: "4px", marginTop: "6px" }}
          >
            {data?.activity?.activity_type?.name}
          </Typography>
        </Stack>
      </Box>

      <Box
        padding={4}
        background="neutral0"
        shadow="filterShadow"
        style={{ flex: 1 }}
      >
        <Stack>
          <Typography
            variant="omega"
            textColor="neutral600"
            style={{ marginBottom: "6px" }}
          >
            Customer
          </Typography>
          <Divider />
          <Typography
            variant="omega"
            style={{ marginBottom: "4px", marginTop: "6px" }}
          >
            {data?.customer?.name}
          </Typography>
          <Typography variant="omega" style={{ marginBottom: "4px" }}>
            {data?.customer?.phone}
          </Typography>
          <Typography variant="omega" style={{ marginBottom: "4px" }}>
            {data?.customer?.email}
          </Typography>
        </Stack>
      </Box>
    </Flex>
  );
}
