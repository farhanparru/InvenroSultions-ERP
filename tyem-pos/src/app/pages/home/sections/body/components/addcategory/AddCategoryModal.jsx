import React, { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStoreUserData } from "../../../../../../store/storeUser/storeUserSlice";
import {
  addAndSelectCustomer,
  addStoreCustomers,
  getStoreCustomers,
} from "../../../../store/customerSlice";
import { addNewCategory, addNewItem, getCategoryList, getItemCategories } from "../../../../store/homeSlice";
import { notification } from "antd";

const AddCategoryModal = ({ isOpen, setOpen }) => {
  const { Option } = Select;
  const store_user = useSelector(getStoreUserData);
  const allCategories = useSelector(getCategoryList);

  const [network, setNetwork] = useState(window.navigator.onLine);
  const [notificationApi, contextHolder] = notification.useNotification();

  const [countryCode, setcountryCode] = useState(0);
  const handleCancel = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log(values,'values');
    const newCustomer = {
      token: store_user.data.auth_token,
      item_category_id: values.item_category_id,
      name: values.name,
      arabic_name: values.arabic_name || "",
      description: values.desc || "",
      arabic_description: values.arabic_desc || "",
      position: values.position || "",
      store_id:store_user?.data?.id
    };
    if (network) {
      dispatch(addNewCategory(newCustomer));

      notificationApi["success"]({
        message: "Category addedd Successfully",
        description: "Category addedd Successfully",
      });

      setTimeout(() => {
    setOpen(false);
        
      }, 200);
    } else {
      // dispatch(addAndSelectCustomer(newCustomer));
    }

  };

  const [phoneFocused, setphoneFocused] = React.useState(false);

  const prefixSelector = (
    <Form.Item name={"prefix"} required noStyle>
      <Select onChange={(e) => setcountryCode(e)} style={{ width: 70 }}>
        <Option value="91">+91</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );
  const [form] = Form.useForm();
  const NumpadKey = ({ keyValue, span }) => {
    return (
      <div
        onClick={() => {
          let state = form.getFieldValue("phone");
          // console.log(state);

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
  };

  return (
    <Modal
      open={isOpen}
      title="Add New Category"
      onCancel={handleCancel}
      width={"50%"}
      footer={[]}
    >
      <Form
        {...layout}
        form={form}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
      >
       

        <Form.Item
          name={"name"}
          label="Category Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"arabic_name"}
          label="Arabic Name"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={"desc"}
          label="Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name={"arabic_desc"}
          label="Arabic Description"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          name={"position"}
          label="Enter Position"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <button
            htmltype="submit"
            key={"save&add"}
            className="px-3 rounded-lg   w-full py-2 bg-green-600 text-white font-bold transition-all hover:scale-90"
          >
            Save & Add
          </button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;

const layout = {
  layout: "vertical",
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
