import { Wrapper } from "../../css/PageStyle";
import MessierCard from "../subcomponents/MessierCard";
import Pagination from "../subcomponents/Pagination";
import usePagination from "../../hooks/usePagination";
import MessierModalContent from "../subcomponents/MessierModalContent";
import { useState, useEffect, useRef } from "react";
import { IoMdArrowDropup, IoMdCloseCircleOutline } from "react-icons/io";
import useModal from "../../hooks/useModal";
import Select from "react-select";
import { messierSelectOptions } from "../../data";

import axios from "axios";

export default function Messiers() {
	const selectMenuRef = useRef();

	const [messiers, setMessiers] = useState({});
	const [selectedMessier, setSelectedMessier] = useState({});
	const { showModal, openModal, closeModal, placeModal, placeCursor } =
		useModal(setSelectedMessier);
	const [filteredMessierId, setFilteredMessierId] = useState("");
	const [filteredMessierObj, setFilteredMessierObj] = useState({});

	const {
		currentPageIndex,
		setCurrentPageIndex,
		maxPageIndex,
		increasePagePerOne,
		decreasePagePerOne,
	} = usePagination(messiers.total_count, 20);

	const fetchMessiers = async (pageIndex) => {
		const pageOffset = pageIndex * 20;
		const apiBase = import.meta.env.VITE_DATASTRO_API_URL;
		const datasetSegment = `catalogue-de-messier/records`;
		const orderSegment = `order_by=messier`;
		const limitSegment = `limit=20`;
		const offsetSegment = `offset=${pageOffset}`;
		const targetUrl =
			apiBase +
			datasetSegment +
			"?" +
			orderSegment +
			"&" +
			limitSegment +
			"&" +
			offsetSegment;
		try {
			const response = await axios.get(targetUrl);
			setMessiers(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchOneMessier = async (id) => {
		const apiBase = import.meta.env.VITE_DATASTRO_API_URL;
		const datasetSegment = `catalogue-de-messier/records`;
		const whereSegment = `where=messier%3D%22${id}%22`;
		const targetUrl = apiBase + datasetSegment + "?" + whereSegment;
		try {
			const response = await axios.get(targetUrl);
			setFilteredMessierObj(response.data.results[0]);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (filteredMessierId === "all") {
			setFilteredMessierObj({});
			return;
		}
		if (filteredMessierId !== "") {
			fetchOneMessier(filteredMessierId);
		}
	}, [filteredMessierId]);

	useEffect(() => {
		fetchMessiers(currentPageIndex);
	}, [currentPageIndex]);

	const handleFilteredPanelClose = () => {
		setFilteredMessierObj({});
		selectMenuRef.current.setValue({ value: "all", label: "all" });
	};

	const customStyles = {
		option: (styles, state) => ({
			...styles,
			cursor: "pointer",
		}),
		control: (styles) => ({
			...styles,
			cursor: "pointer",
		}),
	};

	return (
		<Wrapper>
			<article className="title">
				<div>-Messiers Objects-</div>
			</article>
			<article className="intro">
				Charles Messier (1730-1817) was a French astronomer. He
				published an astronomical catalogue consisting of 110 nebulae
				and star clusters, the Messier objects. Messier's purpose for
				the catalogue was to help astronomical observers distinguish
				between permanent and transient visually diffuse objects in the
				sky. He compiled a list of them, in collaboration with his
				friend and assistant Pierre Méchain, to avoid wasting time
				sorting them out from the comets they were looking for.
			</article>
			<article className="search">
				<div className="form-container">
					<div className="form-control">
						<label htmlFor="messier-select" className="form-label">
							Select one : &nbsp;
						</label>
						<Select
							styles={customStyles}
							ref={selectMenuRef}
							options={messierSelectOptions}
							name="messier-select"
							className="form-select"
							onChange={(evt) => {
								setFilteredMessierId(evt.value);
							}}
						/>
					</div>
				</div>
			</article>
			{Object.keys(filteredMessierObj).length > 0 && (
				<article className="modal modal-select">
					<div
						className="cross-icon"
						onClick={handleFilteredPanelClose}
					>
						<IoMdCloseCircleOutline />
					</div>
					<MessierModalContent messierObj={filteredMessierObj} />
				</article>
			)}
			<article className="grid">
				{messiers.results &&
					messiers.results.length > 0 &&
					messiers.results.map((obj, index) => (
						<div key={index} onClick={(evt) => openModal(evt, obj)}>
							<MessierCard messierObj={obj} />
						</div>
					))}
			</article>
			<article
				id="cursor"
				className={`cursor ${showModal ? "show" : "hide"}`}
			>
				<IoMdArrowDropup />
			</article>
			<article
				id="modal"
				className={`modal ${showModal ? "show" : "hide"} `}
			>
				<div className="cross-icon" onClick={closeModal}>
					<IoMdCloseCircleOutline />
				</div>
				{Object.keys(selectedMessier).length > 0 && (
					<MessierModalContent messierObj={selectedMessier} />
				)}
			</article>
			<Pagination
				setCurrentPageIndex={setCurrentPageIndex}
				currentPageIndex={currentPageIndex}
				maxPageIndex={maxPageIndex}
				increasePagePerOne={increasePagePerOne}
				decreasePagePerOne={decreasePagePerOne}
			/>
		</Wrapper>
	);
}
