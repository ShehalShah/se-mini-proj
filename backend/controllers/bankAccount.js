const BankAccountSchema = require("../models/BankAccountModel");
const { getLoginUserId } = require("./auth");

exports.addBankAccount = async (req, res) => {
  const { name, amount, account, ifsc } = req.body;
  const userId = getLoginUserId(); // Get the user ID using the function

  const bankAccount = BankAccountSchema({
    user: userId,
    name,
    amount,
    account,
    ifsc,
  });

  try {
    //validations
    if (!name || !amount) {
      return res
        .status(400)
        .json({ message: "Mandatory fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    await bankAccount.save();
    res.status(200).json({ message: "Bank Account Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }

  console.log(bankAccount);
};

exports.getBankAccounts = async (req, res) => {
  const userId = getLoginUserId(); // Get the user ID using the function
  try {
    const bankAccounts = await BankAccountSchema.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateBankAccount = async (req, res) => {
  const { id } = req.params;
  const { name, amount, account, ifsc } = req.body;

  try {
    const updatedBankAccount = await BankAccountSchema.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          amount,
          account,
          ifsc,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Bank Account Updated",
      bankAccount: updatedBankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteBankAccount = async (req, res) => {
  const { id } = req.params;
  BankAccountSchema.findByIdAndDelete(id)
    .then((bankAccount) => {
      res.status(200).json({ message: "Bank Account Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
};
