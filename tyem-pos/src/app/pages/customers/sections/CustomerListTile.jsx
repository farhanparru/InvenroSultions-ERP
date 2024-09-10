
import { useDispatch } from "react-redux";

const CustomerListTile = ({ customer, isSelected, bgClass, setDrawerVisible }) => {
    const dispatch = useDispatch();
  
    const onClick = () => {
      setDrawerVisible(true);
      dispatch(setSelectedCustomer(customer));
    };
  
    return (
      <div
        onClick={onClick}
        className={`flex gap-5 items-center p-5 rounded-xl transition-all cursor-pointer ${
          isSelected
            ? "bg-blue-700"
            : `${bgClass ?? "bg-gray-100"} hover:bg-blue-100 hover:scale-95`
        }`}
      >
        <div className="flex-1">
          <h2 className={`text-lg font-bold ${isSelected ? "text-white" : ""}`}>
            {customer.name}
          </h2>
          <p className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-500"}`}>
            {customer.phone}
          </p>
        </div>
        <p className={`text-sm font-bold ${isSelected ? "text-white" : ""}`}>
          {customer.lastActive}
        </p>
      </div>
    );
  };
  
  export default CustomerListTile;
  