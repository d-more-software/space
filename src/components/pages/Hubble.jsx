import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Wrapper } from "../../css/PageStyle";
import HubbleCard from "../subcomponents/HubbleCard";
import Pagination from "../subcomponents/Pagination";
import usePagination from "../../hooks/usePagination";
import useModal from "../../hooks/useModal";
import { IoMdArrowDropup, IoMdCloseCircleOutline } from "react-icons/io";
import HubbleModalContent from "../subcomponents/HubbleModalContent";
import { FiChevronsRight } from "react-icons/fi";

export default function Hubble() {
	const formRef = useRef();
	const [hubbles, setHubbles] = useState({});
	const [filters, setFilters] = useState({ term: "" });
	const [selectedHubble, setSelectedHubble] = useState({});
	const [searchedHubbles, setSearchedHubbles] = useState({});
	const { showModal, openModal, closeModal, placeModal, placeCursor } =
		useModal(setSelectedHubble);

	const {
		currentPageIndex,
		setCurrentPageIndex,
		maxPageIndex,
		increasePagePerOne,
		decreasePagePerOne,
	} = usePagination(hubbles.total_count, 20);
	const {
		currentPageIndex: currentPageIndexSearch,
		setCurrentPageIndex: setCurrentPageIndexSearch,
		maxPageIndex: maxPageIndexSearch,
		increasePagePerOne: increasePagePerOneSearch,
		decreasePagePerOne: decreasePagePerOneSearch,
	} = usePagination(searchedHubbles.total_count, 20);

	const fetchHubbles = async (pageIndex) => {
		const pageOffset = pageIndex * 20;
		const apiBase = import.meta.env.VITE_DATASTRO_API_URL;
		const datasetSegment = `nasahubble/records`;
		const limitSegment = `limit=20`;
		const offsetSegment = `offset=${pageOffset}`;
		const targetUrl =
			apiBase + datasetSegment + "?" + limitSegment + "&" + offsetSegment;

		try {
			const response = await axios.get(targetUrl);
			setHubbles(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	const fetchSearchedHubbles = async (term, pageIndex) => {
		const pageOffset = pageIndex * 20;
		const apiBase = import.meta.env.VITE_DATASTRO_API_URL;
		const datasetSegment = `nasahubble/records`;
		const whereSegment = `where=photo_title%20like%20%22${term}%22%20or%20photo_description%20like%20%22${term}%22`;
		const limitSegment = `limit=20`;
		const offsetSegment = `offset=${pageOffset}`;
		const targetUrl =
			apiBase +
			datasetSegment +
			"?" +
			whereSegment +
			"&" +
			limitSegment +
			"&" +
			offsetSegment;
		try {
			const response = await axios.get(targetUrl);
			setSearchedHubbles(response.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (filters.term === "") {
			setSearchedHubbles({});
		} else {
			fetchSearchedHubbles(filters.term, currentPageIndexSearch);
		}
	}, [filters, currentPageIndexSearch]);

	useEffect(() => {
		fetchHubbles(currentPageIndex);
	}, [currentPageIndex]);

	const handleSubmit = (evt) => {
		evt.preventDefault();
		const formData = new FormData(formRef.current);
		const data = {
			term: formData.get("hubble-search"),
		};
		setFilters(data);
	};

	const handleSearchedPanelClose = () => {
		setSearchedHubbles({});
		const resetBtn = document.getElementById("reset");
		resetBtn.click();
	};

	return (
		<Wrapper>
			<article className="title">
				<div>-Hubble Photos-</div>
			</article>
			<article className="intro">
				The Hubble Space Telescope is a space telescope that was
				launched into low Earth orbit in 1990 and remains in operation.
				Hubble features a 2.4 m (7 ft 10 in) mirror, and its five main
				instruments observe in the ultraviolet, visible, and
				near-infrared regions of the electromagnetic spectrum. Hubble is
				the only telescope designed to be maintained in space by
				astronauts. Five Space Shuttle missions have repaired, upgraded,
				and replaced systems on the telescope.
			</article>

			<article className="search">
				<form
					onSubmit={handleSubmit}
					ref={formRef}
					className="form-container"
				>
					<div className="form-control">
						<label htmlFor="hubble-search" className="form-label">
							Search for : &nbsp;
						</label>
						<div className="form-input-reset">
							<input
								id="hubble-search"
								name="hubble-search"
								type="text"
								className="form-select form-input"
							/>
							<input
								id="reset"
								type="reset"
								value="x"
								className="form-reset"
							/>
						</div>
						<button type="submit" className="search-btn">
							Search <FiChevronsRight className="icon" />
						</button>
					</div>
				</form>
			</article>
			<div className="hello">
				{Object.keys(searchedHubbles).length > 0 && (
					<article className="modal modal-select">
						<div>Your searched results for : {filters.term}</div>
						<div
							className="cross-icon"
							onClick={handleSearchedPanelClose}
						>
							<IoMdCloseCircleOutline />
						</div>
						{searchedHubbles.results.length > 0 ? (
							<>
								{searchedHubbles.results.map((obj, idx) => (
									<HubbleModalContent
										key={idx}
										hubbleObj={obj}
									/>
								))}
								<Pagination
									setCurrentPageIndex={
										setCurrentPageIndexSearch
									}
									currentPageIndex={currentPageIndexSearch}
									maxPageIndex={maxPageIndexSearch}
									increasePagePerOne={
										increasePagePerOneSearch
									}
									decreasePagePerOne={
										decreasePagePerOneSearch
									}
								/>
							</>
						) : (
							<>No results</>
						)}

						<div>End of search results</div>
					</article>
				)}
			</div>
			<article className="grid">
				{hubbles.results &&
					hubbles.results.length > 0 &&
					hubbles.results.map((obj, index) => (
						<div
							onClick={(evt) => openModal(evt, obj)}
							className=""
							key={index}
						>
							<HubbleCard hubbleObj={obj} />
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
				{Object.keys(selectedHubble).length > 0 && (
					<HubbleModalContent hubbleObj={selectedHubble} />
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
