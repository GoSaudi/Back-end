import {
  Box,
  Table,
  Thead,
  Tr,
  Tbody,
  Link,
  Flex,
  Th,
  Td,
  Typography,
  Button,
} from "@strapi/design-system";
import React, { useState } from "react";
import DeleteModal from "./DeleteModal";

const ROW_COUNT = 6;
const COL_COUNT = 10;

export default function AppTable({ data: entries, handleAction }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const closeModal = () => {
    setDeleteId(null);
    setModalOpen(false);
  };

  const getHrObj = (ChkHr) => {
    if (ChkHr > 0) {
      return {
        hr: Math.abs(ChkHr),
        suf: "PM",
      };
    } else if (ChkHr < 0) {
      return {
        hr: Math.abs(ChkHr),
        suf: "AM",
      };
    } else {
      return {
        hr: 12,
        suf: "PM",
      };
    }
  };

  return (
    <>
      <Box style={{ marginTop: "4rem" }} background="neutral100">
        <Typography variant="beta">Activity Posted by Vendor</Typography>
        <Box style={{ marginTop: "2rem" }}>
          <Table colCount={COL_COUNT} rowCount={ROW_COUNT}>
            <Thead>
              <Tr>
                <Th>
                  <Typography variant="sigma">Activity Name</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Category</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Amount</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Date</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Start Time</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Duration</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Actions</Typography>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {entries.map((entry) => {
                const [hr, min] = entry?.start_time
                  ? entry?.start_time?.split(":")
                  : "00:00:00";

                const ChkHr = parseInt(hr) - 12;
                const HrObj = getHrObj(ChkHr);

                return (
                  <Tr key={entry.id}>
                    <Td>
                      <Typography textColor="neutral800">
                        <Link
                          to={`/content-manager/collectionType/api::activity.activity/${entry.id}`}
                        >
                          {entry.name}
                        </Link>
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.cost_category?.name}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        ${entry.amount || 0}/person
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.date}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{`${HrObj.hr}:${min} ${HrObj.suf} `}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {entry.duration || 0} hrs
                      </Typography>
                    </Td>
                    <Td>
                      <Flex>
                        <Button
                          variant="success-light"
                          onClick={() => handleAction(entry.id, "approved")}
                        >
                          Approve
                        </Button>
                        <Box paddingLeft={1}>
                          <Button
                            variant="danger"
                            onClick={() => {
                              if (entry.id) {
                                setDeleteId(entry.id);
                                setModalOpen(true);
                              }
                              // handleAction(entry.id, "reject")
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Flex>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </Box>
      </Box>
      {modalOpen && (
        <DeleteModal
          closeModal={closeModal}
          setModalOpen={setModalOpen}
          handleDeleteAction={handleAction}
          deleteId={deleteId}
        />
      )}
    </>
  );
}
