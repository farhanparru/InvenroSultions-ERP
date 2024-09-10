import React, { useState } from "react";
import { Button, Form, Input, Modal, Radio, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addAndSelectCustomer,
  addStoreCustomers,
  getStoreCustomers,
} from "../../home/store/customerSlice";
import { getStoreUserData } from "../../../store/storeUser/storeUserSlice";

const AddCustomerModal = ({ isOpen, setOpen, handleSetCustomerFocused }) => {
  const { Option } = Select;
  const store_user = useSelector(getStoreUserData);
  const [network, setNetwork] = useState(window.navigator.onLine);

  const [countryCode, setCountryCode] = useState(0);
  const [gender, setGender] = useState("Male");
  const [form] = Form.useForm();
  const [phoneFocused, setPhoneFocused] = useState(false);

  const handleCancel = () => {
    setOpen(false);
    handleSetCustomerFocused(false);
  };

  const dispatch = useDispatch();

  const onFinish = (values) => {
    const newCustomer = {
      token: store_user.accessToken,
      gender: values.gender,
      name: values.fullName,
      lastName: "",
      email: values.email || "",
      mobile: values.phone,
      address: values.address || "",
      country_code: countryCode,
      vat: values.taxNo || "",
      language: values.language || "",
      supplier_business_name: store_user?.business?.name,
    };
    if (network) {
      dispatch(addStoreCustomers({ customer_data: newCustomer, token: store_user?.accessToken }));
      dispatch(getStoreCustomers(store_user?.accessToken));
    } else {
      dispatch(addAndSelectCustomer(newCustomer));
    }

    setOpen(false);
    handleSetCustomerFocused(false);
  };

  const prefixSelector = (
    <Form.Item name="prefix" required noStyle>
      <Select onChange={(e) => setCountryCode(e)} style={{ width: 100 }}>
        <Option value="973">+973</Option>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const NumpadKey = ({ keyValue, span }) => (
    <div
      onClick={() => {
        let state = form.getFieldValue("phone");
        if (state === undefined) {
          state = "";
        }
        if (keyValue === "Clear") {
          state = "";
          form.setFieldsValue({ phone: state });
        } else {
          form.setFieldsValue({ phone: state + keyValue });
        }
      }}
      className={`numpad__key py-2 px-3 md:px-5 lg:px-7 xl:px-8 ${
        span ? span : ""
      }
       bg-slate-100 rounded-md  text-center items-center
          cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-900
          hover:scale-90
       `}
    >
      <p className="text-xl font-bold ">{keyValue}</p>
    </div>
  );

  return (
    <Modal
      open={isOpen}
      title="Add Customer"
      onCancel={handleCancel}
      width={"50%"}
      footer={null}
    >
      <Form
        {...layout}
        form={form}
        name="add-customer"
        onFinish={onFinish}
        initialValues={{ gender: gender }}
        validateMessages={validateMessages}
      >
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: "Please input the full name!" }]}
          >
            <Input className="py-2 px-3 border rounded-md" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email" }]}
          >
            <Input className="py-2 px-3 border rounded-md" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input className="py-2 px-3 border rounded-md" />
          </Form.Item>
          <Form.Item name="language" label="Language">
            <Select
              style={{ width: "100%" }}
              className="py-2 px-3 border rounded-md"
            >
              <Option value="en">English</Option>
              <Option value="es">Spanish</Option>
              <Option value="fr">French</Option>
              <Option value="de">German</Option>
              <Option value="zh">Chinese</Option>
            </Select>
          </Form.Item>
          <Form.Item name="taxNo" label="Tax No">
            <Input className="py-2 px-3 border rounded-md" />
          </Form.Item>
          <div
            tabIndex={0}
            onFocus={() => setPhoneFocused(true)}
            onBlur={() => setPhoneFocused(false)}
            className="relative"
          >
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: "Please input your phone number!" }]}
            >
              <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
            </Form.Item>
            {phoneFocused && (
              <div className="absolute right-1/2 w-[80%] translate-x-1/2 top-[100%] numpad__keys grid bg-white px-2 pb-2 z-50 grid-cols-3 gap-2 mt-2">
                <NumpadKey keyValue={"1"} />
                <NumpadKey keyValue={"2"} />
                <NumpadKey keyValue={"3"} />
                <NumpadKey keyValue={"4"} />
                <NumpadKey keyValue={"5"} />
                <NumpadKey keyValue={"6"} />
                <NumpadKey keyValue={"7"} />
                <NumpadKey keyValue={"8"} />
                <NumpadKey keyValue={"9"} />
                <NumpadKey keyValue={"0"} />
                <NumpadKey keyValue={"Clear"} span="col-span-2" />
              </div>
            )}
          </div>
          <Form.Item name="gender" label="Gender" className="col-span-2">
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            onClick={handleCancel}
            className="bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </Button>
          <Button
            htmlType="submit"
            className="bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCustomerModal;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};
