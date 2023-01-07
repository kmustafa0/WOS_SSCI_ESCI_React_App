import "./App.css";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import f from "./data/data.json";
import ReactPaginate from "react-paginate";

function App() {
  const [items, setItem] = useState([]);
  const [searchItem, setSearchItem] = useState([]);
  const [filterItem, setFilterItem] = useState("");
  const [currentItemPage, setCurrentItemPage] = useState(1);
  const postItemPerPage = 30;

  const rgx = new RegExp(/^\d{0,}.\d/gi);
  const regex = /[a-z]/g;

  useEffect(() => {
    setItem(f.data);
    setSearchItem(f.data);
  }, []);

  const readExcel = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { raw: true });
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((d) => {
      setItem(d);
      setSearchItem(d);
    });
  };

  const lastPostIndex = currentItemPage * postItemPerPage;
  const firstPostIndex = lastPostIndex - postItemPerPage;
  const currentPosts = items.slice(firstPostIndex, lastPostIndex);

  const totalPosts = Math.ceil(items.length / postItemPerPage);

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setItem(searchItem);
    } else if (rgx.test(e.target.value)) {
      const filterResult = searchItem.filter((item) =>
        item.ISSN.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setItem(filterResult);
      const filterResult2 = searchItem.filter((item) =>
        item.eISSN.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setItem(filterResult2);
    } else if (regex.test(e.target.value)) {
      const filterResult = searchItem.filter((item) =>
        item["Journal_name"]
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      setItem(filterResult);
    }
    setFilterItem(e.target.value);
  };

  const handlePageClick = (data) => {
    setCurrentItemPage(data.selected + 1);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          readExcel(file);
          setCurrentItemPage(1);
        }}
      />
      <br />
      <br />
      <div className="input-group">
        <div className="form-outline ">
          <input
            type="search"
            value={filterItem}
            onInput={(e) => handleFilter(e)}
            className={"form-control justify-content-center"}
            placeholder="Search"
          />
        </div>
      </div>
      <br />
      <table className="table table-hover table-striped table-sm table-responsive-sm table-bordered">
        <thead>
          <tr className={"text-center"}>
            <th scope="col">Journal name</th>
            <th scope="col">JCR Abbreviation</th>
            <th scope="col">ISSN</th>
            <th scope="col">eISSN</th>
            <th scope="col">Category</th>
            <th scope="col">Total Citations</th>
            <th scope="col">2020 JIF</th>
            <th scope="col">JIF Quartile</th>
            <th scope="col">2020 JCI</th>
            <th scope="col">% of OA Gold</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((d) => (
            <tr key={d.Journal_name} className={"text-center"}>
              <th scope="row">{d.Journal_name}</th>
              <td>{d["JCR Abbreviation"]}</td>
              <td>{d["ISSN"]}</td>
              <td>{d["eISSN"]}</td>
              <td>{d["Category"]}</td>
              <td>{d["Total Citations"]}</td>
              <td>{d["2020 JIF"]}</td>
              <td>{d["JIF Quartile"]}</td>
              <td>{d["2020 JCI"]}</td>
              <td>{d["% of OA Gold"]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPosts}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-center"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
        activeLinkClassName={"page-link"}
      />
    </div>
  );
}

export default App;
