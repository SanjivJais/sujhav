namespace NepSolve.Utilities
{
    public class HexToByte
    {
        public static byte[] HexStringToByteArray(string hex)
        {
            return Enumerable.Range(0, hex.Length / 2)
                .Select(i => Convert.ToByte(hex.Substring(i * 2, 2), 16))
                .ToArray();
        }
    }
}
