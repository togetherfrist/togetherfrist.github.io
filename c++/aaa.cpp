#include <iostream>
using namespace std;

int lengthOfLongestSubstring(string s) {
        int i = 0;
        int j = 1;
        int da = 0;
        while(i < s.length()){
            if(j >= s.length()){
               da = max(da, j - i);
               break;
            }
            int pos = -1;
            for(int k = i; k < j; k++){
               if(s[k] == s[j]){
                  pos = k;
               }
            }
            if(pos > -1){
               da = max(da, j - i);
               i = pos + 1;
               j = i + 1;
            }else{
               j++;
            }
        }
        return da;
   }

int main ()
{
   string s1 = "abcabbb123 51";
   cout << lengthOfLongestSubstring(s1) << endl;
   return 0;
}