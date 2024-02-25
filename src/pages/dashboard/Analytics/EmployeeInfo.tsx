import React, { useEffect, useState } from "react";
// supabase
import supabase from "../../../config/supabaseClient";
interface EmployeeInfoProps {
  empId: string;
  empName: string;
  designation: string;
  empTagBattery: string;
  empStatus: string;
  sensorId: string;
  sensorStatus: string;
  lastUpdate: string;
}

const EmployeeInfo: React.FC<EmployeeInfoProps> = ({
  empId,
  empName,
  designation,
  empTagBattery,
  empStatus,
  sensorId,
  sensorStatus,
  lastUpdate,
}) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: "50px",
      backgroundColor: "#f8f9fa",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      marginBottom: "20px",
    },
    info: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: "10px",
    },
    button: {
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  const [fetchError, setFetchError] = useState("");
  const [fypData, setFypData] = useState<any>("");
  const myStyle = {
    width: "100%",
  };
  const mapping = {
    marginBottom: "60px",
    border: "1px solid blue",
    padding: "30px",
  };

  useEffect(() => {
    const fetchFypData = async () => {
      try {
        const { data, error } = await supabase
          .from("main")
          .select("*")
          .order("Timestamp", { ascending: false }); // Order by timestamp_column in descending order

        if (error) {
          throw error;
        }

        if (data) {
          const uniqueNamesMap = new Map();

          // Iterate over the data and update the map with the latest record for each unique name
          data.forEach((record) => {
            const name = record.Employee_Name.trim();

            // If the name is not in the map or if the current record is newer, update the map
            if (
              !uniqueNamesMap.has(name) ||
              record.Timestamp > uniqueNamesMap.get(name).Timestamp
            ) {
              uniqueNamesMap.set(name, record);
            }
          });

          // Extract the values from the map to get unique records with the latest values
          const uniqueRecords = Array.from(uniqueNamesMap.values());
          setFypData(uniqueRecords);
          setFetchError("");
          console.log(uniqueRecords);
        }
      } catch (error) {
        setFetchError("Could not fetch data");
        console.error(error);
      }
    };

    fetchFypData();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Tracking</h1>
      {fetchError && <p>{fetchError}</p>}
      {fypData && (
        <div style={myStyle}>
          {fypData.map((data: any) => (
            <div key={data.id} style={mapping}>
              {/* <div style={styles.info}>
                <span>Emp ID:</span>
                <span>{data.empId}</span>
              </div> */}
              <div style={styles.info}>
                <span>Emp Name:</span>
                <span style={{ fontSize: "30px" }}>{data.Employee_Name}</span>
              </div>
              <div style={styles.info}>
                <span>Designation:</span>
                <span>Worker</span>
              </div>
              <div style={styles.info}>
                <span>Emp Tag Battery:</span>
                <span style={{ color: "green" }}>80%</span>
              </div>
              <div style={styles.info}>
                <span>Location:</span>
                <span style={{ color: "red" }}>Warehouse</span>
              </div>
              <div style={styles.info}>
                <span>Sensor ID:</span>
                <span>{data.RSSI}</span>
              </div>
              <div style={styles.info}>
                <span>Employee Status:</span>
                <span style={{ color: "green" }}>
                  {data.RSSI ? "Active" : "Offline"}
                </span>
              </div>
              {/* <div style={styles.info}>
                <span>Last Update:</span>
                <span>{data.lastUpdate}</span>
              </div> */}
              {/* ... */}
              {/* <button style={styles.button}>Detail</button> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeInfo;