#include <iostream>
using namespace std;

class Solution {
public:
    string convert(string s, int numRows) {
      int n = s.size();
      int t0 = numRows - 1;
      int T = t0 * 2;
      if(t0 == 0){T = 1;}
      string s1[numRows];
      string s2;
      int i = 0;
      while(i < n){
        int pos = t0 - abs(i % T - t0);
        s1[pos] += s[i];
        i++;
      }
      for(int j = 0; j < numRows; j++){
        s2 = s2 + s1[j];
      }
      return s2;
      
    }
};

int main(int argc, char const *argv[])
{
   Solution so;
   string s1 = "PAYPALISHIRING";
   int row = 3;
   cout << so.convert(s1, row) << endl;

}
