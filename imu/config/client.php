<?php
/* Copyright (c) 2012 KE Software Pty Ltd
*/
$config['server-host'] = '208.103.112.150';
$config['server-port'] = 40233;

/* Catalogue
*/
$config['search-aliases']['keywords']['ecatalogue'] = array
(
    'CatCatalogNumber',
    'CatSpecies',
    'CatVariety',
    'CatPseudoAfter',
    'PhmAssociatedSpecies1',
    'PhmAssociatedSpecies1',
    'ColHisCurrentCountryLocal',
    'ColHisCurrentStateLocal',
    'ColHisCurrentCountyLocal',
    'ColHisCurrentRegionLocal',
    'ColHisCurrentTownshipLocal',
    'ColHisCurrentCityLocal',
    'ColHisCurrentMineLocal',
    'ColHisCurrentMineDistrictLocal',
    'CatStorageID', 
    'CatStorageName', 
    'CatCaseNumber',
    'CatOldCollectionName_tab', 
    'CatDimensions', 
    #'CatWeight', 
    'CatWeightUnit',
    'CatColor', 
    'CatDescription' 
);
$config['fetch-sets']['browse']['ecatalogue'] = array
(
    'irn',
    'multimedia',
    'SummaryData',

    'narratives=<enarratives:ObjObjectsRef_tab>.
    (
        irn, 
        image, 
        title=NarTitle
    )',

    'CatCatalogNumber',
    'CatSpecies',
    'CatVariety',
    'PhmAssociatedSpecies1',
    'ColHisCurrentCountryLocal',
    'ColHisCurrentStateLocal',
    'ColHisCurrentCountyLocal',
    'ColHisCurrentRegionLocal',
    'ColHisCurrentTownshipLocal',
    'ColHisCurrentCityLocal',
    'ColHisCurrentMineLocal',
    'ColHisCurrentMineDistrictLocal',
    'CatStorageID',
    'CatStorageName',
    'CatCaseNumber',
    'CatOldCollectionName_tab',
    'CatDimensions',
    'CatWeight',
    'CatWeightUnit',
    'CatColor',
    'CatDescription'
);
$config['fetch-sets']['collection']['ecatalogue'] = array
(
    'irn',
    'image',
    'title=SummaryData'
);
$config['fetch-sets']['details']['ecatalogue'] = array
(
    'irn',
    'multimedia',
    'SummaryData',

    'narratives=<enarratives:ObjObjectsRef_tab>.
    (
        irn, 
        image, 
        title=NarTitle
    )',

    'CatCatalogNumber',
    'CatSpecies',
    'CatVariety',
    'CatPseudoAfter',
    'PhmAssociatedSpecies1',
    'ColHisCurrentCountryLocal',
    'ColHisCurrentStateLocal',
    'ColHisCurrentCountyLocal',
    'ColHisCurrentRegionLocal',
    'ColHisCurrentTownshipLocal',
    'ColHisCurrentCityLocal',
    'ColHisCurrentMineLocal',
    'ColHisCurrentMineDistrictLocal',
    'CatStorageID',
    'CatStorageName',
    'CatCaseNumber',
    'CatOldCollectionName_tab',
    'CatDimensions',
    'CatWeight',
    'CatWeightUnit',
    'CatColor',
    'CatDescription'
);
$config['fetch-sets']['lightbox']['ecatalogue'] = array
(
    'irn',
    'title=SummaryData',
    'image',
    'CatSpecies',
    'CatVariety',
    'PhmAssociatedSpecies1'
);
$config['fetch-sets']['list']['ecatalogue'] = array
(
    'irn',
    'title=SummaryData',
    'image',
    'CatSpecies',
    'CatVariety',
    'PhmAssociatedSpecies1'
);

$config['fetch-sets']['tree']['ecatalogue'] = array 
(
    'title = SummaryData',
    'parent = AssParentObjectRef',
    'children = <ecatalogue:AssParentObjectRef>.irn'
);
?>
