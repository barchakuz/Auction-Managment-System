import React, { useState, useEffect } from "react";
import { Col, Empty, Row, Space, notification } from "antd";
import Toolbar from "../../components/Toolbar";
import { get, getDatabase, ref, update } from "firebase/database";
import { useAuth } from "../../hooks/context";
import Loader from "../../components/Loader";
import DisputeCard from "../../components/DisputeCard";
import AddDispute from "../../components/AddDispute";
import Header from "../../components/Header";

const DisputeList = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [filterList, setFilterList] = useState(null);
  const [disputeList, setDisputeList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);

  const onFilter = (_filters) => {
    const tmp = [...disputeList].filter((dispute) => {
      if (_filters.status && _filters.status !== "all") {
        return dispute.status === _filters.status;
      }

      return true;
    });

    setFilterList(tmp);
    setFilters(_filters);
  };

  const loadDisputes = async () => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `dispute`);
      get(valueRef)
        .then((snapshot) => {
          const disputes = [];
          snapshot.forEach(function (childSnapshot) {
            const userDisputes = childSnapshot.val();

            if (
              userDisputes.userId === user.userId ||
              user.userType === "admin"
            )
              disputes.push({ ...userDisputes, did: childSnapshot.key });
          });

          setDisputeList(disputes);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const updateDispute = async (did) => {
    try {
      const db = getDatabase();
      const valueRef = ref(db, `dispute`);
      get(valueRef)
        .then((snapshot) => {
          snapshot.forEach(function (childSnapshot) {
            if (childSnapshot.key === did) {
              update(ref(db, `dispute/${did}`), { status: "resolved" }).then(
                () => {
                  notification.success({
                    message: "Status updated sucessfully",
                    key: "dispute-status-update-notification",
                    placement: "bottomRight",
                  });
                  loadDisputes();
                }
              );
            }
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadDisputes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Space size={20} direction="vertical" className="w-100 global-padding">
        <Header title="Disputes" />
        <Toolbar
          onAdd={
            user.userType === "admin" ? undefined : () => setShowAdd(!showAdd)
          }
          buttonText="Add Dispute"
          toolbarFilters={[]}
          selectProps={{
            placeholder: "Select Status",
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Resolved", value: "resolved" },
            ],
            name: "status",
          }}
          filters={filters}
          onFilterChange={(filter) => onFilter({ ...filters, ...filter })}
        />

        {(filterList || disputeList).length ? (
          <Row gutter={[20, 20]}>
            {(filterList || disputeList).map((dispute) => (
              <Col key={dispute.did} span={24}>
                <DisputeCard
                  {...dispute}
                  onUpdate={updateDispute}
                  user={user}
                />
              </Col>
            ))}
          </Row>
        ) : loading ? (
          <Space
            className="w-100 h-100"
            direction="vertical"
            align="center"
            style={{ justifyContent: "center" }}
          >
            <Loader />
          </Space>
        ) : (
          <Empty />
        )}
      </Space>
      {showAdd && (
        <AddDispute onClose={() => setShowAdd(false)} onFinish={loadDisputes} />
      )}
    </>
  );
};

export default DisputeList;
