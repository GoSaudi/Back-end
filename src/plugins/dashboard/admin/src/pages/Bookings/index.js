/*
 *
 * Bookings
 *
 */

import React, { useEffect, useState } from "react";
import { Flex } from "@strapi/design-system";
import CountsBox from "../../components/CountsBox";
import AppTable from "../../components/Table";
import { useFetchClient } from "@strapi/helper-plugin";

const Bookings = () => {
  const client = useFetchClient();
  const [data, setData] = useState({});
  const [activities, setActivities] = useState([]);

  const getActivities = () => {
    client.get("/dashboard/pendingActivities").then((data) => {
      console.log(data);
      setActivities(data?.data);
    });
  };

  const getCounts = () => {
    client.get("/dashboard/overview").then((data) => {
      console.log(data);
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
        <CountsBox label={"Total Activities"} count={data?.totalActivities} />

        <CountsBox
          label={"Approved Activities"}
          count={data?.approvedActivities}
        />
        <CountsBox label={"Total Bookings"} count={data?.bookings} />
        <CountsBox
          label={"Confirmed Bookings"}
          count={data?.confirmedBookings}
        />
        <CountsBox label={"Total Vendors"} count={data?.vendors} />
      </Flex>
      <AppTable data={activities} handleAction={handleAction} />
    </div>
  );
};

export default Bookings;
