import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    Slider,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button,
    ButtonGroup,
} from "@nextui-org/react";
import axiosInstance from "../../axios/axiosInstance";
import { USERS_URL } from "../../constants/urls";
import { toast as hottoast } from "react-hot-toast";


function UserSettings() {
  const userId = useSelector((state) => state.logUser.user.id);
  const [gender, setGender] = useState("Male");
  const [age, setAge] = useState([18, 24]);
  const [distance, setDistance] = useState(10);
  
  const dropdownRef = useRef()

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUpdateSettings = () => {
    dropdownRef.current.click()
    
    const data = {
        'age_min': age[0],
        'age_max': age[1],
        'distance': distance,
        'gender': gender
    }
    axiosInstance
      .post(`${USERS_URL}/update_settings/${userId}`, data)
      .then((res) => {
        console.log("set_res ==>", res);
        if (res.status == 200) {
          hottoast.success("Settings updated");
        }
      })
      .catch((err) => {
        console.log("set_err ==>", err);
      })
      .finally(() => {});
  };


  return (
    <Dropdown  >
      <DropdownTrigger>
        <Button ref={dropdownRef} color="secondary" variant="flat">
          Filters
        </Button>
      </DropdownTrigger>
      <DropdownMenu closeOnSelect={false} aria-label="Static Actions">
        <DropdownItem className="p-1">
          <div className="flex flex-col w-full max-w-md border p-1 rounded-lg">
            <Slider
              label="Age"
              step={1}
              minValue={18}
              maxValue={60}
              value={age}
              color="danger"
              className="max-w-md"
              onChange={setAge}
            />
          </div>
        </DropdownItem>
        <DropdownItem className="p-1">
          <div className="flex flex-col w-full max-w-md border p-1 rounded-lg">
            <Slider
              label="Near by"
              step={1}
              maxValue={80}
              minValue={1}
              color="danger"
              defaultValue={10}
              className="sm"
              onChangeEnd={setDistance}
            />
          </div>
        </DropdownItem>
        <DropdownItem className="p-1 hover: bg-none">
          <div className="flex flex-col w-full max-w-md border p-1 rounded-lg hover: bg-none">
            <ButtonGroup>
              {gender == "Male" ? (
                <Button color="danger" variant="flat">
                  Male
                </Button>
              ) : (
                <Button
                  color="danger"
                  variant="light"
                  value="Male"
                  onClick={handleGenderChange}
                >
                  Male
                </Button>
              )}
              {gender == "Female" ? (
                <Button color="danger" variant="flat">
                  Female
                </Button>
              ) : (
                <Button
                  color="danger"
                  variant="light"
                  value="Female"
                  onClick={handleGenderChange}
                >
                  Female
                </Button>
              )}
              {gender == "Others" ? (
                <Button color="danger" variant="flat">
                  Others
                </Button>
              ) : (
                <Button
                  color="danger"
                  variant="light"
                  value="Others"
                  onClick={handleGenderChange}
                >
                  Others
                </Button>
              )}
            </ButtonGroup>
          </div>
        </DropdownItem>
        <DropdownItem closeOnSelect={true}>
          <span>
            <Button
              color="danger"
              onClick={handleUpdateSettings}
              variant="solid"
              type="submit"
            >
              Apply
            </Button>
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserSettings;
