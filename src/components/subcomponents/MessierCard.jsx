import { Wrapper } from "../../css/CardStyle";

export default function MessierCard({ messierObj }) {
	const {
		messier,
		ngc,
		english_name_nom_en_anglais,
		french_name_nom_francais,
		latin_name_nom_latin,
		image_url,
	} = messierObj;
	const { url, id } = image_url;
	return (
		<Wrapper>
			<img src={url} alt={`mars-img-${id}`} />
			<div>{messier}</div>
			<div>{ngc}</div>
			<div>
				conste : &nbsp;{" "}
				{english_name_nom_en_anglais ||
					french_name_nom_francais ||
					latin_name_nom_latin ||
					"?"}
			</div>
		</Wrapper>
	);
}
