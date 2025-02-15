import useFetchData from "../../hooks/useFetchData";
import { Wrapper } from "../../css/PageStyle";

export default function Apod() {
	const apiBase = import.meta.env.VITE_NASA_API_URL;
	const apiKey = import.meta.env.VITE_NASA_API_KEY;
	const apiEndpointSegment = "planetary/apod";
	const keySegment = `api_key=${apiKey}`;
	const targetUrl = apiBase + apiEndpointSegment + "?" + keySegment;
	const { data, loading, error } = useFetchData(targetUrl);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return <p>Error: {error}</p>;
	}

	return (
		data && (
			<Wrapper>
				<article className="title">
					<div>-Astronomy Picture of the Day-</div>
				</article>
				<article className="grid-small">
					{data.media_type && data.media_type === "video" ? (
						<iframe
							height="100%"
							width="100%"
							src={data.url}
						></iframe>
					) : (
						<div className="img-container">
							<img src={data.url} alt="apod-img" />
						</div>
					)}
					<div className="text-container">
						<div>
							<span className="subtitle">Title : </span>
							<span>{data.title}</span>
						</div>
						<div>
							<span className="subtitle">Date : </span>
							<span>{data.date}</span>
						</div>
						<div>
							<span className="subtitle">Copyright : </span>
							<span>{data.copyright}</span>
						</div>
						<div>
							<span className="subtitle">Explanation : </span>
							<span>{data.explanation}</span>
						</div>
					</div>
				</article>
			</Wrapper>
		)
	);
}
