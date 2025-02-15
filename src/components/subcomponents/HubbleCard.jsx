import { Wrapper } from "../../css/CardStyle";

export default function HubbleCard({ hubbleObj }) {
	const { photo_title, photo_url_m } = hubbleObj;
	const { url } = photo_url_m;

	return (
		<Wrapper>
			<img src={url} alt="main-hubble" />
			<div>{photo_title}</div>
		</Wrapper>
	);
}
