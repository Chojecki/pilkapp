import { FC } from "react";

interface ItemCardProps {
  title: string;
  boldTitle: string;
  icon?: React.ReactNode;
}

const ItemCard: FC<ItemCardProps> = ({ title, boldTitle, icon }) => {
  return (
    <div className="flex flex-row bg-gray-900 shadow-xl	shadow-gray-700/50 rounded-xl border border-gray-800 p-4">
      <div className="flex items-center justify-center flex-shrink-0 h-12 w-12 rounded-xl bg-sky-100 text-blue-500">
        {icon && icon}
      </div>
      <div className="flex flex-col flex-grow ml-4">
        <div className="text-sm text-sky-200">{title}</div>
        <div className="text-sky-100 font-extrabold text-lg">{boldTitle}</div>
      </div>
    </div>
  );
};

export default ItemCard;
