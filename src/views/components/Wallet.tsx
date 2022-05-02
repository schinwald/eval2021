import { Grid, Card, CardHeader, CardContent, Icon, Fab, Divider, Box, Typography, Chip, Button, Paper } from "@mui/material"
import { styled } from "@mui/material"
import { useState } from "react";
import qrcode from "../../assets/images/qr-code.png";
import { Copy } from "./primitives";
import { WalletType, AddressType } from "../../types";
import AnimatedNumber from "react-awesome-animated-number";
import useSWR from "swr";

const CustomizedCard = styled(Card)(
    ({ theme }) => `
    position: relative;
    &::before {
        content: "";
        z-index: 4;
        position: absolute;
        top: 0%; right: 0%; bottom: 0%; left: 0%;
        background-color: ${theme.palette.primary.main};
        opacity: 0.15;
    }
    &::after {
        content: "";
        position: absolute;
        z-index: 4;
        top: 0%; right: 0%; bottom: 0%; left: 0%;
        clip-path: ellipse(100% 50% at 30% 15%);
        background-color: rgba(255, 255, 255);
    }
    & > * {
        position: relative;
        z-index: 5;
    }
`)

type Props = {
    wallet: WalletType;
    onRename: (value: string) => void;
    onLoadMoney: (value: number) => void;
}

export const Wallet: React.FC<Props> = (props) => {
    let [ editMode, setEditMode ] = useState<boolean>(false);
    let activeAddress: AddressType | null = null;

    if (props.wallet) {
        activeAddress = props.wallet.addresses.reduce((previous, current, index) => {
            if (index === 0) return previous
            if (previous.createdAt > current.createdAt) return previous
            else return current
        })
    }

    return ( 
        props.wallet && activeAddress
        ?
        <CustomizedCard elevation={6}>
            <CardHeader 
                title={<Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    { 
                        editMode
                        ?
                        <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> {props.wallet.alias}</Typography>
                        :
                        <Typography variant="h5"><Icon fontSize="large" sx={{ verticalAlign: 'middle' }}>credit_card</Icon> {props.wallet.alias}</Typography>
                    }
                    <Fab color="secondary" size="small" onClick={() => {
                        if (editMode) {
                            console.log("submit rename")
                        }
                        setEditMode(!editMode)
                    }}><Icon>{editMode ? "done" : "edit"}</Icon></Fab>
                </Box>}
            />
            <Divider />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '1em' }}>
                        <Chip label="Balance" size="small" />
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em' }}>
                            <Typography color="secondary.dark" variant="h1" sx={{ display: 'flex' }}>
                                $
                                <AnimatedNumber value={props.wallet.balance}
                                    style={{
                                        transition: '0.8s ease-out',
                                        transitionProperty: 'background-color, color, opacity',
                                        display: 'flex',
                                        flexDirection: 'row-reverse',
                                        overflowY: 'hidden',
                                    }}
                                    size={96}
                                    hasComma={true}
                                    duration={300}/>
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography color="secondary.dark" variant="h4" sx={{ display: 'flex', lineHeight: '1' }}>
                                    .
                                    <AnimatedNumber value={0}
                                        style={{
                                            transition: '0.8s ease-out',
                                            transitionProperty: 'background-color, color, opacity',
                                            display: 'flex',
                                            flexDirection: 'row-reverse',
                                            overflowY: 'hidden',
                                        }}
                                        size={34}
                                        hasComma={false}
                                        minDigits={2}
                                        duration={300}/>
                                </Typography>
                                <Typography variant="h4">BTC</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                                <Typography><Icon sx={{ verticalAlign: 'middle' }}>fingerprint</Icon>{activeAddress.value}</Typography>
                                <Copy text={activeAddress.value} placement="right" />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5em', padding: "0.5em 0.5em" }}>
                                <Button color="secondary" variant="contained" startIcon={<Icon>receipt</Icon>}>Load Money</Button>
                            </Box>
                        </Box>
                    </Box>
                    </Grid>
                    <Grid item xs={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em' }}>
                        <Chip label="QR Code" size="small" />
                        <Paper elevation={3}>
                            <img alt="Sample QR Code" src={props.wallet.qrcode} width={256} height={256} />
                        </Paper>
                    </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </CustomizedCard>
        :
        null
    )
}