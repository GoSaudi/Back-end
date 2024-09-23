/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from "react";
import { Flex } from "@strapi/design-system";
import CountsBox from "../../components/CountsBox";
import AppTable from "../../components/Table";
import { useFetchClient } from "@strapi/helper-plugin";

const HomePage = () => {
  const client = useFetchClient();
  const [data, setData] = useState({});
  const [activities, setActivities] = useState([]);

  const getActivities = () => {
    client.get("/dashboard/pendingActivities").then((data) => {
      setActivities(data?.data);
    });
  };

  const getCounts = () => {
    client.get("/dashboard/overview").then((data) => {
      setData(data.data[0]);
    });
  };
  useEffect(() => {
    getCounts();
    getActivities();
  }, []);

  const handleAction = (id, type, approvalReason) => {
    client
      .put("/dashboard/approveRejectActivity", {
        id,
        approved: type == "approved" ? "Approved" : "Rejected",
        approvalReason,
      })
      .then(() => {
        getCounts();
        getActivities();
      });
  };
  return (
    <div>
      <Flex gap={4} wrap={"wrap"}>
        <CountsBox
          label={"No.of Activity posted by vendors"}
          count={data?.totalActivities}
        />
        <CountsBox
          label={"No.of Approved vendor activity"}
          count={data?.approvedActivities}
        />
        <CountsBox label={"Total customer booking"} count={data?.bookings} />
        <CountsBox
          label={"No.of Confirmed bookings"}
          count={data?.confirmedBookings}
        />
        <CountsBox label={"Total Vendors"} count={data?.vendors} />
      </Flex>
      <AppTable data={activities} handleAction={handleAction} />
    </div>
  );
};

export default HomePage;
