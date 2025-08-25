import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { SEARCH_PRODUCTS } from "../../graphql/queries/products.query";
import { type Product } from "../../types/products";

interface SearchProductsResponse {
  searchProducts: {
    products: Product[];
  } | null;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({
  placeholder = "Search for products...",
  className,
}: SearchBarProps) => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const [searchProducts, { data, loading }] =
    useLazyQuery<SearchProductsResponse>(SEARCH_PRODUCTS);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim().length > 1) {
      searchProducts({ variables: { query: value, limit: 10, skip: 0 } });
    }
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleSearchSubmit = (products: Product[]) => {
    const trimmedSearch = search.trim();

    if (trimmedSearch.length > 1 && products.length > 0) {
      navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`);
      setSearch("");
    }
  };

  useEffect(() => {
    if (
      search.length > 1 &&
      (data?.searchProducts?.products?.length ?? 0) > 0
    ) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [search.length, data]);

  const products = data?.searchProducts?.products ?? [];

  return (
    <div className={`relative flex items-center ${className || ""}`}>
      <input
        type="text"
        value={search}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-400"
        onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(products)}
      />

      {search.length > 0 && (
        <button
          onClick={handleClearSearch}
          className="absolute right-16 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-500 dark:hover:text-gray-200"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}

      <button
        onClick={() => handleSearchSubmit(products)}
        className="px-3 py-2 cursor-pointer bg-gradient-to-r from-[#c9812f] to-blue-500 text-white rounded-r-md"
      >
        <Search size={26} />
      </button>

      {search.length > 1 && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-black border dark:border-gray-300 border-gray-400 rounded shadow-lg z-50">
          {loading && (
            <p className="p-3 text-gray-500 dark:text-gray-300">Searching...</p>
          )}

          {products.length > 0 ? (
            <ul className="divide-y divide-gray-500">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="px-4 py-3 hover:bg-gray-100 dark:hover:bg-[#3c3c3c] cursor-pointer transition-colors"
                  onClick={() => {
                    navigate(
                      `/products?search=${encodeURIComponent(search.trim())}`
                    );
                    setSearch("");
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {p.title}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ${p.price}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            !loading && <p className="p-3 text-gray-500">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
