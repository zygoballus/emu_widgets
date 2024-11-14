<?php
/* Copyright (c) 2012 KE Software Pty Ltd
*/
$config['multimedia-cache-size'] = '200M';

$config['include-modules'] = array
(
	'enarratives',
	'ecatalogue',
	'eparties',
	'emultimedia'
);

$config['search-aliases'] = array
(
	'artist-search' => array
	(
		'ecatalogue' => array
		(
			'SummaryData'
		),
		'enarratives' => array
		(
			'SummaryData'
		),
		'eparties' => array
		(
			'SummaryData'
		),
		'emultimedia' => array
		(
			'SummaryData'
		)
	),

	'keywords' => array
	(
		'ecatalogue' => array
		(
			'SummaryData'
		),
		'enarratives' => array
		(
			'DesSubjects_tab',
			'NarNarrative',
			'NarTitle',
			'SummaryData'
		),
		'eparties' => array
		(
			'BioCommencementNotes',
			'SummaryData'
		),
		'emultimedia' => array
		(
			'MulTitle',
			'SummaryData'
// TODO: MIME type?
		)
	),
	

	'subjects' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'DesSubjects_tab'
		),
		'eparties' => array
		(
		),
		'emultimedia' => array
		(
			'DetSubject_tab'
		)
	),

	'title' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'NarTitle'
		),
		'eparties' => array
		(
			'SummaryData'
		),
		'emultimedia' => array
		(
			'MulTitle'
		)
	),

	'media-type' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
		),
		'eparties' => array
		(
		),
		'emultimedia' => array
		(
			'MulMimeType',
			'DetResourceType'
		)
	),

	'what' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'DesType_tab',
			'NarTitle',
			'NarType_tab'
		),
		'eparties' => array
		(
			'NamPartyType',
			'NamRoles_tab'
		),
		'emultimedia' => array
		(
			'DetResourceType',
			'MulMimeFormat',
			'MulMimeType',
			'MulTitle'
		)
	),

	'when' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'NarDate0'
		),
		'eparties' => array
		(
			'BioBirthDate',
			'BioDeathDate'
		),
		'emultimedia' => array
		(
			'DetDate0'
		)
	),

	'where' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'DesGeographicLocation_tab'
		),
		'eparties' => array
		(
			'AddPhysCity',
			'AddPhysCountry',
			'AddPhysPost',
			'AddPhysState',
			'AddPhysStreet'
		),
		'emultimedia' => array
		(
			'DetLanguage_tab',
			'DetPublisher'
		)
	),

	'who' => array
	(
		'ecatalogue' => array
		(
		),
		'enarratives' => array
		(
			'NarAuthorsSummaryLocal_tab'
		),
		'eparties' => array
		(
			'NamFirst',
			'NamLast',
			'NamOrganisation',
		),
		'emultimedia' => array
		(
			'MulCreator_tab'
		)
	)
);

$config['fetch-sets'] = array
(
	'browse' => array
	(
		'ecatalogue' => array
		(
			'multimedia',
			'irn',
			'narratives=<enarratives:ObjObjectsRef_tab>.
			(
				image,
				irn,
				title=NarTitle
			)',
			'title=SummaryData'
		),
		'enarratives' => array
		(
			'irn',
			'associations=AssAssociatedWithRef_tab.
			(
				image,
				irn,
				title=NarTitle
			)',
			'children=HieChildNarrativesRef_tab.
			(
				image,
				irn,
				title=NarTitle
			)',
			'description=NarNarrative{format:html-clean}',
			'multimedia',
			'objects=ObjObjectsRef_tab.
			(
				image,
				irn,
				title=SummaryData
			)',
			'title=NarTitle',
			'trails.
			(
				irn,
				title=NarTitle
			)'
		),
		'eparties' => array
		(
			'irn',
			'title=SummaryData',
			'birthDate=BioBirthDate',
			'birthPlace=BioBirthPlace',
			'business=NamBusiness_tab',
			'city=AddPhysCity',
			'country=AddPhysCountry',
			'deathDate=BioDeathDate',
			'email=AddEmail',
			'fax=NamFax',
			'firstName=NamFirst',
			'home=NamHome',
			'lastName=NamLast',
			'role=NamRoles_tab',
			'organisation=NamOrganisation',
			'partyType=NamPartyType',
			'postcode=AddPhysPost',
			'street=AddPhysStreet',
			'state=AddPhysState',
			'mobile=NamMobile',
			'nationality=BioNationality',
			'web=AddWeb',
			'multimedia'
		),
		'emultimedia' => array
		(
			'irn',
			'title=MulTitle',
			'creators=MulCreator_tab',
			'mimeType=MulMimeType',
			'mimeFormat=MulMimeFormat',
			'description=MulDescription',
			'resourceType=DetResourceType',
			'language=DetLanguage_tab',

			// Details
			'publisher=DetPublisher',
			'contributors=DetContributor_tab',
			'source=DetSource',
			'rights=DetRights',

			// Characteristics
			'audience=ChaAudience_tab',

			// Media Attributes
			'mediaForm=ChaMediaForm',
			'fileSize=ChaFileSize',
			'checkSum=ChaMd5Sum',

			// Image/Video
			'resolution=ChaImageResolution',
			'width=ChaImageWidth',
			'height=ChaImageHeight',
			'colourDepth=ChaImageColorDepth',
			'filmLength=ChaVideoFilmLength',


			// Audio
			'samplesPerSec=ChaAudioSamplesPerSec',
			'bitsPerSample=ChaAudioBitsPerSample',
			'numChannels=ChaAudioNumberOfChannels',
			'audioDuration=ChaAudioLength',

			// Metadata
			'ExiIfd_tab',
			'ExiTag_tab',
			'ExiName_tab',
			'ExiValue_tab',

			'IptRecord_tab',
			'IptTag_tab',
			'IptName_tab',
			'IptValue_tab',

			'XmpMetadata',

			// Additional multimedia
			'resolutions',
			'supplementary',

			'Multimedia'
		)
	),

	'collection' => array
	(
		'ecatalogue' => array
		(
			'image',
			'irn',
			'title=SummaryData'
		),
		'enarratives' => array
		(
			'image',
			'irn',
			'title=NarTitle'
		),
		'eparties' => array
		(
			'image',
			'irn',
			'title=SummaryData'
		),
		'emultimedia' => array
		(
//TODO: image?
			'irn',
			'title=MulTitle',
			'mimeType=MulMimeType'
		)
	),

	'details' => array
	(
		'ecatalogue' => array
		(
			'irn',
			'title=SummaryData',
			'multimedia',
		),
		'enarratives' => array
		(
			'irn',
			'associations=AssAssociatedWithRef_tab.
			(
				image,
				irn,
				title=NarTitle
			)',
			'children=HieChildNarrativesRef_tab.
			(
				image,
				irn,
				title=NarTitle
			)',
			'description=NarNarrative{format:html-clean}',
			'multimedia',
			'objects=ObjObjectsRef_tab.
			(
				image,
				irn,
				title=SummaryData
			)',
			'parents=<enarratives:HieChildNarrativesRef_tab>.
			(
				image,
				irn,
				title=NarTitle
			)',
			'title=NarTitle'
		),
		'eparties' => array
		(
			'irn',
			'title=SummaryData',
			'multimedia',
			'partyType=NamPartyType',
			'lastName=NamLast',
			'firstName=NamFirst',
			'role=NamRoles_tab',
			'birthPlace=BioBirthPlace',
			'birthDate=BioBirthDate',
			'deathDate=BioDeathDate',
			'organisation=NamOrganisation',
			'street=AddPhysStreet',
			'city=AddPhysCity',
			'state=AddPhysState',
			'postcode=AddPhysPost',
			'country=AddPhysCountry',
			'email=AddEmail',
			'web=AddWeb',
			'business=NamBusiness_tab',
			'home=NamHome',
			'mobile=NamMobile',
			'fax=NamFax'
		),
		'emultimedia' => array
		(
			'irn',
			'title=MulTitle',
			'creators=MulCreator_tab',
			'mimeType=MulMimeType',
			'mimeFormat=MulMimeFormat',
			'description=MulDescription',
			'resourceType=DetResourceType',
			'language=DetLanguage_tab',

			// Details
			'publisher=DetPublisher',
			'contributors=DetContributor_tab',
			'source=DetSource',
			'rights=DetRights',

			// Characteristics
			'audience=ChaAudience_tab',

			// Media Attributes
			'mediaForm=ChaMediaForm',
			'fileSize=ChaFileSize',
			'checkSum=ChaMd5Sum',

			// Image/Video
			'resolution=ChaImageResolution',
			'width=ChaImageWidth',
			'height=ChaImageHeight',
			'colourDepth=ChaImageColorDepth',
			'filmLength=ChaVideoFilmLength',


			// Audio
			'samplesPerSec=ChaAudioSamplesPerSec',
			'bitsPerSample=ChaAudioBitsPerSample',
			'numChannels=ChaAudioNumberOfChannels',
			'audioDuration=ChaAudioLength',

			// Metadata
			'exif=
			[
				ifd=ExiIfd_tab,
				tag=ExiTag_tab,
				name=ExiName_tab,
				value=ExiValue_tab
			]',

			'iptc=
			[
				record=IptRecord_tab,
				tag=IptTag_tab,
				name=IptName_tab,
				value=IptValue_tab
			]',

			'XmpMetadata',

			// Additional multimedia
			'resolutions',
			'supplementary',

			'Multimedia'
		)
	),

	'lightbox' => array
	(
		'ecatalogue' => array
		(
			'irn',
			'title=SummaryData',
			'image'
		),
		'enarratives' => array
		(
			'irn',
			'title=NarTitle',
			'image'
		),
		'eparties' => array
		(
			'irn',
			'title=SummaryData',
			'image'
		),
		'emultimedia' => array
		(
			'irn',
			'title=MulTitle',
			'SummaryData',
			'mimeType=MulMimeType',
			'mimeFormat=MulMimeFormat'
		)
	),

	'list' => array
	(
		'ecatalogue' => array
		(
			'irn',
			'title=SummaryData',
			'image'
		),
		'enarratives' => array
		(
			'irn',
			'title=NarTitle',
			'description=NarNarrative{format:html-strip}',
			'SummaryData',
			'image'
		),
		'eparties' => array
		(
			'irn',
			'title=SummaryData',
			'image',
			'partyType=NamPartyType',
			'birthDate=BioBirthDate',
			'deathDate=BioDeathDate',
			'street=AddPhysStreet',
			'city=AddPhysCity',
			'state=AddPhysState',
			'postcode=AddPhysPost',
			'country=AddPhysCountry',
			'web=AddWeb'
		),
		'emultimedia' => array
		(
			'irn',
			'title=MulTitle',
			'SummaryData',
			'mimeType=MulMimeType',
			'mimeFormat=MulMimeFormat',
		)
	),

	'locator' => array
	(
		'ecatalogue' => array
		(
			'irn',
			'SummaryData'
		),
		'enarratives' => array
		(
			'irn',
			'SummaryData'
		),
		'eparties' => array
		(
			'irn',
			'SummaryData'
		),
		'emultimedia' => array
		(
			'irn',
			'SummaryData'
		)
	),

	'map' => array
	(
		'ecatalogue' => array
		(
			'irn',
			'SummaryData'
		),
		'enarratives' => array
		(
			'irn',
			'SummaryData'
		),
		'eparties' => array
		(
			'irn',
			'SummaryData'
		),
		'emultimedia' => array
		(
			'irn',
			'SummaryData'
		)
	)
);
?>
