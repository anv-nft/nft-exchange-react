import React from 'react'

const routes = [
	{
		path: "/",
		component: React.lazy(() => import('../../components/home/Home')),
		exact: true,
	},
	{
		path: "/artist_registration",
		component: React.lazy(() => import('../../components/artist_registration/ArtistRegistration')),
		exact: true,
	},
	{
		path: "/my_page",
		component: React.lazy(() => import('../../components/my_page/MyPage')),
		exact: true,
	},
	{
		path: "/connect_wallet",
		component: React.lazy(() => import('../../components/connect_wallet/ConnectWallet')),
		exact: true,
	},
	{
		path: "/swap",
		component: React.lazy(() => import('../../components/swap/Swap')),
		exact: true,
	},
	{
		path: "/mint_artwork",
		component: React.lazy(() => import('../../components/mint_artworks/MintArtWorks')),
		exact: true,
	},
	{
		path: "/market",
		component: React.lazy(() => import('../../components/market/Market')),
		exact: true,
	},
	{
		path: "/artist/:id",
		component: React.lazy(() => import('../../components/artist_page/ArtistPage')),
		exact: true,
	},
	{
		path: "/artist_404",
		component: React.lazy(() => import('../../components/artist_none_page/ArtistNonePage')),
		exact: true,
	},
	{
		path: "/lottery",
		component: React.lazy(() => import('../../components/lottery/Lottery')),
		exact: true,
	},
	{
		path: "/help_desk",
		component: React.lazy(() => import('../../components/help_desk/HelpDesk')),
		exact: true,
	},
	{
		path: "/help_desk_detail/:id",
		component: React.lazy(() => import('../../components/help_desk/help_menu_detail/HelpMenuDetail')),
		exact: true,
	},
	{
		path: "/privacy_policy",
		component: React.lazy(() => import('../../components/privacy/Privacy')),
		exact: true,
	},
	{
		path: "/terms_of_service",
		component: React.lazy(() => import('../../components/terms_of_service/TermsOfService')),
		exact: true,
	},
	{
		path: "/operation_poclicy",
		component: React.lazy(() => import('../../components/operation_policy/OperationPolicy')),
		exact: true,
	},
	{
		path: "/trade/:contract_address/:token_id/:nft_sell_id",
		component: React.lazy(() => import('../../components/market/market_detail/MarketDetail')),
		exact: true,
	},
	{
		path: "/detail/:contract_address/:token_id",
		component: React.lazy(() => import('../../components/my_page/nft_detail/NftDetail')),
		exact: true,
	},
];

export default routes;