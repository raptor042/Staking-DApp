import { config } from "dotenv"
import { ethers, id } from "ethers"

import Pool_ABI from "./config/Pool.json" assert {type:"json"}
import Staking_ABI from "./config/Staking.json" assert {type:"json"}

config()

const { GOERLI_API_URL, PRIVATE_KEY } = process.env

const getProvider = () => {
    return new ethers.JsonRpcProvider(GOERLI_API_URL)
}

const getSigner = () => {
    return new ethers.Wallet(PRIVATE_KEY, getProvider())
}

// const sendstWETH = async () => {
//     const ABI = JSON.stringify(stWETH_ABI)
//     const stWETH = new ethers.Contract(
//         "0xb0460b6b9A410B8D06Eec692379ca09512FC47B1",
//         JSON.parse(ABI).abi,
//         getSigner()
//     )
//     console.log(ethers.formatEther(await stWETH.totalSupply()))

//     await stWETH.transferFrom("0xb0460b6b9A410B8D06Eec692379ca09512FC47B1", "0x6627f8ddc81057368F9717042E38E3DEcb68dAc3", ethers.parseEther("10000"))

//     await stWETH.transferFrom("0xb0460b6b9A410B8D06Eec692379ca09512FC47B1", "0xE6f3a0fF3b2Ef23ca6Bc8167F94efCe2e4E62aa2", ethers.parseEther("10000"))
// }

const createStakingPool = async () => {
    const ABI = JSON.stringify(Staking_ABI)
    const staking = new ethers.Contract(
        "0x1Df698CdF2F6E15EE775f3333ca96aa66345bF31",
        JSON.parse(ABI).abi,
        getSigner()
    )
    // console.log(await staking.pools(0))

    const pool = await staking.createStakingPool(
        "stWETH",
        "0xb0460b6b9A410B8D06Eec692379ca09512FC47B1",
        180,
        ethers.parseEther("100000000"),
        ethers.parseEther("100000")
    )
    // console.log(pool)

    staking.on("CreatePool", (creator, token, pool, ID, duration, amount, e) => {
        console.log(creator, token, pool, ID, duration, amount)
    })
}

const stake = async () => {
    const ABI = JSON.stringify(Pool_ABI)
    const staking = new ethers.Contract(
        "0x294E410f6b6D13A3F54cDcBb98878E2EAd88D5F0",
        JSON.parse(ABI).abi,
        getSigner()
    )
    console.log(
        ethers.formatEther(await staking.TotalStaked()),
        await staking._stakes("0x6627f8ddc81057368F9717042E38E3DEcb68dAc3"),
        ethers.formatEther(await staking.RewardsBalance())
    )

    // await staking.staking(ethers.parseEther("1000000"), 10)

    // staking.on("Staked", (user, amount, e) => {
    //     console.log(user, ethers.formatEther(amount))
    // })

    const _yield = await staking.calculateStakingYield()
    console.log(
        ethers.formatEther(_yield[0]),
        ethers.formatEther(_yield[1])
    )

    await staking.withdrawBalance()

    staking.on("Withdrawal", (user, amount, e) => {
        console.log(user, ethers.formatEther(amount))
    })
}

stake()

// createStakingPool()