import * as React from 'react';
import { Box, Typography } from "@mui/material";
import Images from "./Images";
import List from "./List";
import axios from "axios";
import { API_BASE_URL } from "./api/api-config";
import { useState, useEffect } from "react";
import { call } from "./api/ApiService";
import { format, parseISO, } from "date-fns";
import dayjs from 'dayjs';
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export default function Record() {

  const [imageUpload, setImageUpload] = useState([]);
  const [recentNum, setRecentNum] = useState(null);
  const [startDate, setStartDate] = useState(null);                 // 시작날짜
  const [endDate, setEndDate] = useState(null);                     // 종료날짜
  const [rows, setRows] = useState([]);                             // 레코드(행) 목록
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [open, setOpen] = useState(false);                          // 검색결과 유무 팝업상태

  // useEffect(() => {
  //   showRecord()
  // }, []);

  // rows 상태가 변경될 때마다 재랜더링 ([] <-종속성에 추가)
  // useEffect(() => {
  // }, [rows]);

  useEffect(() => {
    const today = dayjs();
    onQuerySubmit(today, today)
  }, []);

  // 3.차량 출입 로그 기록
  const showRecord = async (imageSrc) => {
    console.log("Enter the car");
    console.log("Image source received:", imageSrc);

    // 이미지 경로를 FormData에 추가
    const formData = new FormData();

    formData.append("file", imageSrc);
    // for (let i = 0; i < imageSrc.length; i++) {
    //   formData.append("files", imageSrc[i]);
    // }

    try {
      const response = await axios.post(`${API_BASE_URL}/main/record`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const data = response.data;
      console.log("Data", data);
      const today = dayjs();
      onQuerySubmit(today, today)

    } catch (error) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up the request:", error.message);
      }
    }
  };

  // 5.날짜별 로그 조회
  const onQuerySubmit = async (startDate, endDate) => {
    console.log("Received startDate:", startDate);
    console.log("Received endDate:", endDate);

    const jsStartDate = startDate.toDate();
    const jsEndDate = endDate.toDate();

    const formattedStartDate = format(jsStartDate, "yyyy-MM-dd");
    const formattedEndDate = format(jsEndDate, "yyyy-MM-dd");

    console.log("Formatted startDate:", formattedStartDate);
    console.log("Formatted endDate:", formattedEndDate);

    call(`/main/search/date/${formattedStartDate}/${formattedEndDate}`, "GET", null)
      .then((data) => {
        console.log("data", data);
        const responseData = data.data;

        if (Array.isArray(responseData)) {
          const updatedRows = responseData.map((record, index) => {
            const formattedDate = format(parseISO(record.date), "yyyy-MM-dd HH:mm:ss");
            return { ...record, id: index + 1, date: formattedDate };         // 새 객체 생성, ... <- 확산 연산자
          }).reverse();

          setRows(updatedRows);
        } else {
          console.error("데이터가 배열이 아닙니다:", responseData.data);
          setOpen(true);
        }
      })
      .catch((error) => {
        console.error("데이터 가져오기 오류:", error);
      });
  };

  const onDateChange = (newStartDate, newEndDate) => {
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onQuerySubmit(newStartDate, newEndDate);
  };

  return (
    <Box sx={{ margin: "20px" }}>
      <Box
        sx={{
          height: '100vh',
          width: '100%',
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: '20px',
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: '65%',
            height: '100vh',
            alignItems: "center",
            justifyContent: "space-between",

          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '50h',
              border: "1px solid rgb(189, 188, 188)",
            }}
          >
            <Images setImageUpload={setImageUpload} showRecord={showRecord} />
          </Box>
          <Box
            sx={{
              width: '100%',
              height: '48vh',
              border: "1px solid rgb(189, 188, 188)",
            }}
          >
            <List isRecord={true} setRows={setRows} rows={rows}
            />
          </Box>
        </Box>

        <Box sx={{
          height: '100vh',
          width: '35%',
          border: "1px solid rgb(189, 188, 188)",
          display: "flex",
        }}>
          <Typography variant="h4">차량번호: {recentNum}</Typography>
        </Box>
      </Box>
    </Box>

  );
}
