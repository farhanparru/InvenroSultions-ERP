import React, { useState } from "react";
import { Button, Form, Input, InputNumber, Modal, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getStoreUserData } from "../../../../../../store/storeUser/storeUserSlice";
import {
  addAndSelectCustomer,
  addStoreCustomers,
  getStoreCustomers,
} from "../../../../store/customerSlice";
import {
  addNewItem,
  getCategoryList,
  getItemCategories,
  getItems,
  getTaxTypeList,
  getUnitsList,
} from "../../../../store/homeSlice";
import { notification } from "antd";

const AddItemModal = ({ isOpen, setOpen }) => {
  const { Option } = Select;
  const store_user = useSelector(getStoreUserData);
  const allCategories = useSelector(getCategoryList);
  const taxTypes = useSelector(getTaxTypeList);
  const units = useSelector(getUnitsList);
  
  const [network, setNetwork] = useState(window.navigator.onLine);
  const [notificationApi, contextHolder] = notification.useNotification();

  const [countryCode, setcountryCode] = useState(0);
  const handleCancel = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();

  const onFinish = (values) => {
    console.log(values, "values");
    const newCustomer = {
      token: store_user.accessToken,
      item_category_id: values.item_category_id,
      name: values.name,
      arabic_name: values.arabic_name || "",
      selling_price: values.selling_price || "",
      unit_id: values.unit_id || "",
      tax_type:values.tax_type || "",
      purchase_price:values.purchase_price || "",
      purchase_price_inc_tax:values.purchase_price_inc_tax || "",
      selling_price_inc_tax : values.selling_price_inc_tax || ""
    };
    if (network) {
      dispatch(addNewItem(newCustomer));

     

      setTimeout(() => {
        dispatch(getItems(store_user?.accessToken));
        notificationApi["success"]({
          message: "Item addedd Successfully",
          description: "Item addedd Successfully",
        });
      //  setOpen(false);
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
          console.log(state);

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
        <p className="text-x2 font-bold ">{keyValue}</p>
      </div>
    );
  };

  return (
    <Modal
      open={isOpen}
      title="Add New Item"
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
        <Form.Item name={"item_category_id"} label="Item Category">
          <Select
            placeholder="Select a option and change input text above"
            // onChange={this.handleSelectChange}
          >
            {allCategories?.map((item, index) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>


        <Form.Item name={"tax_type"} label="Choose Tax Type">
          <Select
            placeholder="Select a option and change input text above"
            // onChange={this.handleSelectChange}
          >
            {taxTypes.map((item, index) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name} ({item?.amount} %)
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name={"unit_id"} label="Choose Unit">
          <Select
            placeholder="Select a option and change input text above"
            // onChange={this.handleSelectChange}
          >
            {units.map((item, index) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.actual_name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name={"name"}
          label="Item Name"
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
          rules={[
            {
              required: true,
            },
          ]}
          name={"purchase_price"}
          label="Purchase Price"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          name={"purchase_price_inc_tax"}
          label="Purchase Price including tax"
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          name={"selling_price"}
          label="Selling Price"
        >
          <Input />
        </Form.Item>

        <Form.Item
          rules={[
            {
              required: true,
            },
          ]}
          name={"selling_price_inc_tax"}
          label="Selling Price including tax"
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

export default AddItemModal;

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
