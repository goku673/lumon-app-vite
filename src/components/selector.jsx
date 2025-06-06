import { useState, useRef, useEffect } from "react";
import Input from "../common/input";
import Button from "../common/button";
import Text from "../common/text";
import CloseIcon from "@mui/icons-material/Close";

const Selector = ({
  items = [],
  selectedItems = [],
  onSelect,
  onRemove,
  isMultiSelect = false,
  placeholder = "Buscar...",
  labelKey = "name",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  const filteredItems = items.filter((item) =>
    item[labelKey].toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={selectorRef}>
      {selectedItems.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md"
              >
                <Text text={item[labelKey]} className="mr-2" />
                <Button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => onRemove(item)}
                  aria-label={`Eliminar ${item[labelKey]}`}
                >
                  <CloseIcon fontSize="small" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="mb-2"
        aria-label="Buscar elementos"
      />
      {isOpen && (
        <ul
          className="absolute z-20 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto w-full shadow-lg"
          role="listbox"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const isSelected = selectedItems.some(
                (selected) => selected.id === item.id
              );
              return (
                <li
                  key={item.id}
                  className={`p-2 hover:bg-[#0f2e5a] cursor-pointer flex items-center hover:text-white ${
                    isSelected ? "bg-[#0f2e5a] text-white" : ""
                  }`}
                  onClick={() => {
                    if (isSelected) {
                      onRemove(item);
                    } else {
                      onSelect(item);
                    }
                    if (!isMultiSelect) {
                      setSearchTerm("");
                      setIsOpen(false);
                    }
                  }}
                  role="option"
                  aria-selected={isSelected}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className={`mr-2 ${isMultiSelect ? "" : "hidden"}`}
                  />
                  <Text text={item[labelKey]} />
                </li>
              );
            })
          ) : (
            <li className="p-2 text-gray-500" role="option">
              No se encontraron resultados
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Selector;